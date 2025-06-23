import { hash } from 'bcryptjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUpAction } from '@/lib/actions/AuthActions';
import prisma from '../db';

// Prisma Mock 설정
// prisma.user.create를 가짜함수 vi.fn()으로 바꾸기
// 이 코드로 테스트 시 실제 DB에 접근하지 않도록 함
vi.mock('../db', () => ({
  default: {
    user: {
      create: vi.fn(),
    },
  },
}));

// bcryptjs hash 함수도 mock(가짜) 처리
// 호출되면 실제 해시가 아니라 hashed_password라는 문자열을 리턴함
vi.mock('bcryptjs', async () => {
  const actual = await vi.importActual<typeof import('bcryptjs')>('bcryptjs');
  return {
    ...actual,
    hash: vi.fn(() => Promise.resolve('hashed_password')),
  };
});

describe('signUpAction()', () => {
  // 테스트할 데이터 두개
  const userInput = {
    name: '홍길동',
    email: 'hong@example.com',
    password: 'password123',
    phone: '010-1234-5678',
    marriageDate: '2024-05-01',
  };

  const mockUserResult = {
    id: 1,
    ...userInput,
    password: 'hashed_password',
  };

  // 테스트 전 mock 함수 호출 기록 초기화 코드
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('비밀번호 가상 해시 처리 + 유저 생성', async () => {
    (prisma.user.create as any).mockResolvedValue(mockUserResult);

    const result = await signUpAction(
      userInput.name,
      userInput.email,
      userInput.password,
      userInput.phone,
      userInput.marriageDate
    );

    expect(hash).toHaveBeenCalledWith(userInput.password, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: userInput.name,
        email: userInput.email,
        password: 'hashed_password',
        phone: userInput.phone,
        marriage_date: userInput.marriageDate,
      },
    });
    expect(result).toEqual({ isSuccess: true, data: mockUserResult });
  });
});
