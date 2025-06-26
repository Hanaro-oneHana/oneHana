import { getUserInfo } from './UserActions';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import prisma from '@/lib/db';

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

describe('getUserInto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })


});

describe('getInterestsByUserId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  
});