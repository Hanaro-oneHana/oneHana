'use server';

import { PrismaClient } from '@/lib/generated/prisma';
import { auth } from '../auth';
import { getCoupleTotalBalance } from './AccountActions';
import { getCoupleUserIds } from './getCoupleUserIds';

const prisma = new PrismaClient();

export async function plusBalance(
  accountId: number,
  amount: number,
  description?: string
) {
  try {
    // 1. 잔액 증가 및 사용자 정보 포함
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

    // 2. 거래 내역 생성
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    await prisma.transaction.create({
      data: {
        account_id: updated.id,
        transaction_date: formatted,
        amount: amount,
        balance: updated.balance,
        description: description ?? '입금',
      },
    });
    // 3. 커플 총 잔액 조회
    const coupleBalance = await getCoupleTotalBalance(user.id);

    // 4. 커플 ID들 추출
    const coupleUserIds = await getCoupleUserIds(user.id);

    // 5. 소켓 전송
    const io = (globalThis as any).io as import('socket.io').Server;
    if (io) {
      for (const uid of coupleUserIds) {
        io.to(`user-${uid}`).emit('balance-updated', {
          accountId: updated.id,
          newBalance: updated.balance,
          accountType: updated.type,
          coupleBalance: coupleBalance.data,
        });
      }
    }

    return { success: true, newBalance: updated.balance };
  } catch (err) {
    console.error('Failed to decrease balance:', err);
    return { success: false };
  }
}

export async function minusBalance(
  accountId: number,
  amount: number,
  description?: string
) {
  try {
    // 1. 잔액 차감 및 사용자 정보 포함
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

    // 2. 거래 내역 생성
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    await prisma.transaction.create({
      data: {
        account_id: updated.id,
        transaction_date: formatted,
        amount: -amount,
        balance: updated.balance,
        description: description ?? '출금',
      },
    });

    // 3. 커플 총 잔액 조회
    const coupleBalance = await getCoupleTotalBalance(user.id);

    // 4. 커플 ID들 추출
    const coupleUserIds = await getCoupleUserIds(user.id);

    // 5. 소켓 전송
    const io = (globalThis as any).io as import('socket.io').Server;
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
    console.error('Failed to decrease balance:', err);
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
