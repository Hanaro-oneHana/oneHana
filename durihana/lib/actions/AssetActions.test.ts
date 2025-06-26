import { getTypeAmounts, getBucketTotalAmount } from './AssetActions';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import prisma from '@/lib/db';

vi.mock('@/lib/db', () => ({
    partnerCalendar: {
      findMany: vi.fn(),
    },
    budgetPlan: {
      findMany: vi.fn(),
    },
}));

describe('AssetActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })
});
