import { getInterestsByUserId, getUserInfo } from './UserActions';
import { getDepositInterestRate, getLoanInterestRate} from './InterestActions';
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
const mockAccount = prisma.account.findMany as Mock;

describe('getUserInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('return empty array if empty', async () => {
        (mockUser as any).mockResolvedValue(null);
  
        const result = await getUserInfo(1);
        expect(result).toBeNull();
  });
  it('return empty array if empty', async () => {
    (mockUser as any).mockResolvedValue({
        name: '홍길동',
        email: 'hong@gmail.com',
        phone: '010-1234-1234',
        marriage_date: '2027-01-01',
      },
    );
  
    const result = await getUserInfo(1);
    expect(result).toEqual({
      이름: '홍길동',
      이메일: 'hong@gmail.com',
      전화번호: '010-1234-1234',
      '결혼 예정일': '2027-01-01',
    });
  });
});

describe('getInterestsByUserId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('show interest with null', async () => {
    mockAccount.mockResolvedValue([{ type: 1 }, { type: 3 }]);

    (getDepositInterestRate as Mock).mockResolvedValue(2.1);
    (getLoanInterestRate as Mock).mockResolvedValue(4.6);

    const result = await getInterestsByUserId(1);
    expect(result).toEqual({
      예금: '2.1%',
      적금: 'X',
      대출: '4.6%',
    });
  });
});