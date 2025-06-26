import { getDepositInterestRate } from './InterestActions';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import prisma from '../db';
import { Decimal } from '../generated/prisma/runtime/library';

vi.mock('@/lib/db', () => ({
  default: {
    partnerCalendar: {
      count: vi.fn(),
    },
    depositInterest: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
  }
}));

const mockCount = prisma.partnerCalendar.count as Mock;
const mockFindFirst = prisma.depositInterest.findFirst as Mock;
const mockFindUnique = prisma.depositInterest.findUnique as Mock;

describe('cal depositInterestRate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  }),

  it('use default rate when step = 0', async () => {
    mockCount.mockResolvedValue(0);
    mockFindFirst.mockResolvedValue({where : {step:0}});
    mockFindUnique.mockResolvedValue({ rate: new Decimal(2.0) })

    const result = await getDepositInterestRate(0);
    expect(result).toBe(2.0);
  })

  it('change rate by step', async () => {
    mockCount.mockResolvedValue(2);
    mockFindFirst.mockResolvedValue({where : {step:5}});
    mockFindUnique.mockResolvedValue({ rate: new Decimal(4.0) })

    const result = await getDepositInterestRate(0);
    expect(result).toBe(4.0);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { step: 2 } });
  })

});