import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { updateRandomCode, tryMating } from './InviteActions';
import prisma from '../db';

vi.mock('../db', () => ({
  default: {
    user: {
      update: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

const mockUpdate = prisma.user.update as Mock;
const mockFindUnique = prisma.user.findUnique as Mock;
const mockFindFirst = prisma.user.findFirst as Mock;

describe('updateRandomCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('update code', async () => {
    await updateRandomCode(1, 'XYZ123');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { code: 'XYZ123' },
    });
  });
});

describe('tryMating', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('return error when user not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await tryMating(1, 'ABC123');
    expect(result).toEqual({
      status: 'error',
      message: '사용자를 찾을 수 없습니다',
    });
  });

  it('return message for user having mate_code', async () => {
    mockFindUnique.mockResolvedValue({ mate_code: 'X' });

    const result = await tryMating(1, 'ABC123');
    expect(result).toEqual({
      status: 'already_linked',
      message: '이미 초대코드를 입력하셨습니다',
    });
  });

  it('return error when mate not found', async () => {
    mockFindUnique.mockResolvedValue({ mate_code: null });
    mockFindFirst.mockResolvedValue(null);

    const result = await tryMating(1, 'ABC123');
    expect(result).toEqual({
      status: 'error',
      message: '상대방이 없습니다',
    });
  });

  it('return error when mate_code already used', async () => {
    mockFindUnique.mockResolvedValue({ mate_code: null });
    mockFindFirst.mockResolvedValue({ mate_code: 'Y' });

    const result = await tryMating(1, 'ABC123');
    expect(result).toEqual({
      status: 'error',
      message: '상대방이 이미 누군가와 연결됐습니다',
    });
  });

  it('update mate_code when success', async () => {
    mockFindUnique.mockResolvedValue({ mate_code: null });
    mockFindFirst.mockResolvedValue({ mate_code: null });
    mockUpdate.mockResolvedValue({});

    const result = await tryMating(1, 'ABC123');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { mate_code: 'ABC123' },
    });
    expect(result).toEqual({ status: 'success' });
  });
});
