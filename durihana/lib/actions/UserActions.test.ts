import { getUserInfo } from './UserActions';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import prisma from '@/lib/db';

vi.mock('./InterestActions', () => ({
  getDepositInterestRate: vi.fn(),
  getSavingsInterestRate: vi.fn(),
  getLoanInterestRate: vi.fn(),
}));

vi.mock('../db', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    account: {
      findMany: vi.fn(),
    },
  },
}));

const mockUser = prisma.user.findUnique as Mock;

describe('getUserInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('return empty array if empty', async () => {
    mockUser.mockResolvedValue(null);
  
    const result = await getUserInfo(1);
    expect(result).toEqual({
      "isSuccess": false,
      "error": "사용자를 찾을 수 없습니다."
    });
  });

  it('return empty array if empty', async () => {
    mockUser.mockResolvedValue({
        name: '홍길동',
        email: 'hong@gmail.com',
        phone: '010-1234-1234',
        marriage_date: '2027-01-01',
      },
    );
  
    const result = await getUserInfo(1);
    expect(result).toEqual({
      "isSuccess": true,
      data: {
        이름: '홍길동',
        이메일: 'hong@gmail.com',
        전화번호: '010-1234-1234',
        '결혼 예정일': '2027-01-01',
      }
    });
  });
});