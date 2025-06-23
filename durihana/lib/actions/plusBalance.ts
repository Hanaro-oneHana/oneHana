'use server';

import { PrismaClient } from '@/lib/generated/prisma';
import { getCoupleTotalBalance } from './AccountActions';

const prisma = new PrismaClient();

export async function plusBalance(accountId: number, amount: number) {
  try {
    // 1. 해당 계좌의 잔액을 증가
    const updated = await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amount,
        },
      },
      include: {
        User: {
          select: {
            id: true,
            code: true,
            mate_code: true,
          },
        },
      },
    });

    const user = updated.User;
    const io = (globalThis as any).io as import('socket.io').Server;

    // 2. 커플의 총 잔액 조회
    const coupleBalance = await getCoupleTotalBalance(user.id);

    // 3. 커플 유저 ID들 찾기
    const coupleUsers = await prisma.user.findMany({
      where: {
        OR: [
          {
            code: user.code,
            mate_code: user.mate_code,
          },
          {
            code: user.mate_code,
            mate_code: user.code,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const coupleUserIds = coupleUsers.map((u) => u.id);

    // 4. socket.io로 커플 양쪽 모두에게 emit
    if (io) {
      for (const uid of coupleUserIds) {
        io.to(`user-${uid}`).emit('balance-updated', {
          accountId: updated.id,
          newBalance: updated.balance,
          accountType: updated.type,
          coupleBalance,
        });
      }
    }

    return { success: true, newBalance: updated.balance };
  } catch (err) {
    console.error('Failed to update balance:', err);
    return { success: false };
  }
}
