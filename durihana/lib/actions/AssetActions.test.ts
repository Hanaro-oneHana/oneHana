import { getTypeAmounts, getBucketTotalAmount } from './AssetActions';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import prisma from '@/lib/db';

vi.mock('@/lib/db', () => ({
  default: {
    partnerCalendar: {
      findMany: vi.fn(),
    },
    budgetPlan: {
      findMany: vi.fn(),
    },
  }
}));

describe('getTypeAmounts ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it('Return empty array if no calendars are found', async () => {
      (prisma.partnerCalendar.findMany as any).mockResolvedValue([]);

      const result = await getTypeAmounts(1);
      expect(result).toEqual([]);
    });
  
  it('Return list of types from partner calendars', async () => {
      (prisma.partnerCalendar.findMany as any).mockResolvedValue([
        {
          PartnerService: {
            Partner: {
              PartnerCategory: {
                type: 'Wedding',
              },
            },
          },
        },
        {
          PartnerService: {
            Partner: {
              PartnerCategory: {
                type: 'Photo',
              },
            },
          },
        },
      ]);

      const result = await getTypeAmounts(1);
      expect(result.map(r => r.name)).toEqual(['Wedding', 'Photo']);
    });
});

describe('getBucketTotalAmount ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  // const result = await getBucketTotalAmount(1);
  
});