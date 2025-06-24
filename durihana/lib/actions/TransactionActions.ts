'use server';

import prisma from '@/lib/db';

export async function getTransactionsByAccountId(accountId: number) {
  try {
    const result = await prisma.transaction.findMany({
      where: {
        account_id: accountId,
        amount: { gt: 0 }, // 양수만 필터링 (입금만)
      },
      orderBy: { transaction_date: 'desc' },
    });

    return result.map((tx) => {
      const [date, time] = tx.transaction_date.split(' ');
      return {
        id: tx.id,
        date,
        time,
        description: '입금', // 고정
        type: '입금',
        amount: tx.amount,
        balance: tx.balance,
      };
    });
  } catch (error) {
    console.error('getTransactionsByAccountId error:', error);
    return [];
  }
}
export const processBudgetPlanTransaction = async (
  userId: number,
  amount: number
): Promise<void> => {
  // 1) 입출금 계좌(type=0) 조회
  const account = await prisma.account.findFirst({
    where: { user_id: userId, type: 0 },
  });
  if (!account) throw new Error('입출금 계좌를 찾을 수 없습니다.');

  // 2) 잔액 계산 및 업데이트
  const newBalance = account.balance - amount;
  await prisma.account.update({
    where: { id: account.id },
    data: { balance: newBalance },
  });

  // 3) Transaction 기록 (format: YYYY-MM-DD HH:mm)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;

  await prisma.transaction.create({
    data: {
      account_id: account.id,
      transaction_date: formattedDate,
      amount: -amount,
      balance: newBalance,
    },
  });
};

export async function getMinusTransactionsByAccountId(accountId: number) {
  try {
    const result = await prisma.transaction.findMany({
      where: {
        account_id: accountId,
        amount: { lt: 0 }, // 음수만 필터링 (출금만)
      },
      orderBy: { transaction_date: 'desc' },
    });

    return result.map((tx) => {
      const [date, time] = tx.transaction_date.split(' ');
      return {
        id: tx.id,
        date,
        time,
        description: tx.description ?? '출금',
        type: '출금',
        amount: tx.amount,
        balance: tx.balance,
      };
    });
  } catch (error) {
    console.error('getMinusTransactionsByAccountId error:', error);
    return [];
  }
}
