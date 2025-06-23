'use server';

import { PrismaClient } from '@/lib/generated/prisma';
import { getCoupleTotalBalance } from './AccountActions';
import { getCoupleUserIds } from './getCoupleUserIds';
import { auth } from '../auth';

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
    const coupleUserIds = await getCoupleUserIds(user.id);

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

export async function minusBalance(accountId: number, amount: number) {
  try {
    // 1. 해당 계좌의 잔액을 감소
    const updated = await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          decrement: amount,
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
    const coupleUserIds = await getCoupleUserIds(user.id);

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

export async function plusBalanceBySessionUser(amount: number) {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!userId) {
    console.error('로그인된 유저가 없습니다.');
    return { success: false, error: 'unauthorized' };
  }

  const mainAccount = await prisma.account.findFirst({
    where: {
      user_id: userId,
      type: 0, // 입출금 통장
    },
    select: {
      id: true,
    },
  });

  if (!mainAccount) {
    return { success: false, error: 'no-account' };
  }

  return plusBalance(mainAccount.id, amount);
}