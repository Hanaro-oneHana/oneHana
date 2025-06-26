
import { getCoupleUserIds, getCoupleNames } from './getCoupleUserIds';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import prisma from '../db';

vi.mock('../db', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

const mockUser = prisma.user.findUnique as Mock;
const mockMany = prisma.user.findMany as Mock;

describe('getCoupleUserIds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

});

describe('getCoupleNames', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

});