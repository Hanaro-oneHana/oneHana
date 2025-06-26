import { getTypeAmounts, getBucketTotalAmount } from './AssetActions';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import prisma from '@/lib/db';

vi.mock('@/lib/db', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));