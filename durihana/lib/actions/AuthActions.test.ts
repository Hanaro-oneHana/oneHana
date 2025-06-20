import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findUserByEmail, signInValidateAction } from './AuthActions';
import * as validatorModule from '../validator';
import prisma from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

// Prisma Mock 설정
// findUnique 가짜함수
vi.mock('@/lib/db', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// bcryptjs 모듈 mock 처리
vi.mock('bcryptjs', async () => {
  const actual = await vi.importActual<typeof import('bcryptjs')>('bcryptjs');
  return {
    ...actual,
    compare: vi.fn(() => Promise.resolve(true)), // 기본값: 비밀번호 일치
  };
});

// zod signInValidator.safeParse 가짜함수 처리
vi.mock('../validator', () => ({
  signInValidator: {
    safeParse: vi.fn(),
  },
}));

// 테스트용 가짜 데이터
const mockUser = {
  id: 1,
  name: '홍길동',
  email: 'hong@example.com',
  password: '$2a$10$hashedpassword',
};

describe('signInValidateAction()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('이메일, 비밀번호 입력안했으면 에러', async () => {
    const result = await signInValidateAction('', '');
    expect(result).toEqual({
      isSuccess: false,
      error: '이메일, 비밀번호를 입력해주세요',
    });
  });

  it('safeParse로 이메일/비밀번호 형식 못뚫으면 에러', async () => {
    vi.spyOn(validatorModule.signInValidator, 'safeParse').mockReturnValue({
      success: false,
      error: new ZodError([]),
    });

    const result = await signInValidateAction('invalid', '123');
    expect(result).toEqual({
      isSuccess: false,
      error: '이메일 또는 비밀번호 형식이 올바르지 않습니다',
    });
  });

  it('존재하지 않는 이메일로 로그인 시도했을 경우 에러', async () => {
    vi.spyOn(validatorModule.signInValidator, 'safeParse').mockReturnValue({
      success: true,
      data: { email: 'notfound@example.com', password: '123456' },
    });

    (prisma.user.findUnique as any).mockResolvedValue(null);

    const result = await signInValidateAction('notfound@example.com', '123456');
    expect(result).toEqual({
      isSuccess: false,
      error: '아이디가 존재하지 않습니다',
    });
  });

  it('비밀번호가 틀린 경우 에러', async () => {
    vi.spyOn(validatorModule.signInValidator, 'safeParse').mockReturnValue({
      success: true,
      data: { email: 'hong@example.com', password: 'wrong-password' },
    });

    (prisma.user.findUnique as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(false); // 비밀번호 불일치

    const result = await signInValidateAction('hong@example.com', 'wrong-password');
    expect(result).toEqual({
      isSuccess: false,
      error: '비밀번호가 올바르지 않습니다',
    });
  });

  it('모두 통과한 경우', async () => {
    vi.spyOn(validatorModule.signInValidator, 'safeParse').mockReturnValue({
      success: true,
      data: { email: 'hong@example.com', password: 'correct-password' },
    });

    (prisma.user.findUnique as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(true); // 비밀번호 일치

    const result = await signInValidateAction('hong@example.com', 'correct-password');
    expect(result).toEqual({
      isSuccess: true,
      data: mockUser,
    });
  });
});

// -----------------------------------------------------------------

describe('findUserByEmail()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('DB에서 유저 찾으면 성공', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(mockUser);

    const result = await findUserByEmail('hong@example.com');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'hong@example.com' },
    });
    expect(result).toEqual({
      isSuccess: true,
      data: mockUser,
    });
  });

  it('DB 에러 발생 시 실패', async () => {
    (prisma.user.findUnique as any).mockRejectedValue(new Error('DB error'));

    const result = await findUserByEmail('error@example.com');
    expect(result).toEqual({
      isSuccess: false,
      error: 'User not found',
    });
  });
});