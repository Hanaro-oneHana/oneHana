import { getAllInterestRates, getDepositInterestRate } from './InterestActions';
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
      findMany: vi.fn(),
    },
    savingsInterest: {
      findMany: vi.fn(), 
    },
    loanInterest: {
      findMany: vi.fn(), 
    }
  }
}));

const mockCount = prisma.partnerCalendar.count as Mock;
const mockFindFirst = prisma.depositInterest.findFirst as Mock;
const mockFindUnique = prisma.depositInterest.findUnique as Mock;

describe('test rateStep by deposit interest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('use default rate when step = 0', async () => {
    mockCount.mockResolvedValue(0);
    mockFindFirst.mockResolvedValue({where : {step:5}});
    mockFindUnique.mockResolvedValue({ rate: new Decimal(2.0) })

    const result = await getDepositInterestRate(0);
    expect(result).toBe(2.0);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { step: 0 } });
  });

  it('change rate by step', async () => {
    mockCount.mockResolvedValue(2);
    mockFindFirst.mockResolvedValue({where : {step:5}});
    mockFindUnique.mockResolvedValue({ rate: new Decimal(4.0) })

    const result = await getDepositInterestRate(0);
    expect(result).toBe(4.0);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { step: 2 } });
  });
});

const mockDeposit = prisma.depositInterest.findMany as Mock;
const mockSaving = prisma.savingsInterest.findMany as Mock;
const mockLoan = prisma.loanInterest.findMany as Mock;

describe('getAllInterestRates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('show rates for each step', async () => {
    mockDeposit.mockResolvedValue([{step: 4, rate: new Decimal(3.5)}]);
    mockSaving.mockResolvedValue([{step: 0, rate: new Decimal(1.5)}]);
    mockLoan.mockResolvedValue([{step: 1, rate: new Decimal(4.1)}]);
    const result = await getAllInterestRates();

    expect(result).toEqual([
      {label: '예금', rates: ['-', '-', '-', '-', '3.50%', '-']},
      {label: '적금', rates: ['1.50%', '-', '-', '-', '-', '-']},
      {label: '대출', rates: ['-', '4.10%', '-', '-', '-', '-']}
    ]);
  })
});