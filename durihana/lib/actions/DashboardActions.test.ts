import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMarriageDate, getCategoriesByUserId } from './DashboardActions';
import prisma from '../db';

vi.mock('../db', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
        },
    partnerCalendar: {
      findMany: vi.fn(),
    },
  },
}));

describe('DashboardActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMarriageDate', () => {
    it('should return empty string if no userId is given', async () => {
      const result = await getMarriageDate(0);
      expect(result).toBe('');
    });

    it('should return marriage_date if user is found', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ marriage_date: '2027-05-10' });

      const result = await getMarriageDate(1);
      expect(result).toBe('2027-05-10');
    });

    it('should return empty string if user is not found', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const result = await getMarriageDate(1);
      expect(result).toBe('');
    });
  });

  describe('getCategoriesByUserId', () => {
    it('should return empty array if no userId is given', async () => {
      const result = await getCategoriesByUserId(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array if no calendars are found', async () => {
      (prisma.partnerCalendar.findMany as any).mockResolvedValue([]);

      const result = await getCategoriesByUserId(1);
      expect(result).toEqual([]);
    });

    it('should return list of types from partner calendars', async () => {
      (prisma.partnerCalendar.findMany as any).mockResolvedValue([
        {
          PartnerService: {
            Partner: {
              PartnerCategory: {
                type: '식장예약',
              },
            },
          },
        },
        {
          PartnerService: {
            Partner: {
              PartnerCategory: {
                type: '스튜디오예약',
              },
            },
          },
        },
      ]);

      const result = await getCategoriesByUserId(1);
      expect(result).toEqual(['식장예약', '스튜디오예약']);
    });
  });
});
