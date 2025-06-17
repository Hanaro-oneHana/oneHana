import prisma from '@/lib/db';

export async function getTransactionsByAccountId(accountId: number) {
  try {
    const result = await prisma.transaction.findMany({
      where: { account_id: accountId },
      orderBy: { transaction_date: 'desc' },
    });

    return result.map((tx) => {
      const [date, time] = tx.transaction_date.split(' ');
      return {
        id: tx.id,
        date,
        time,
        description: '자동이체', // 기본값으로 넣어둠
        type: tx.amount > 0 ? '입금' : '출금',
        amount: tx.amount,
        balance: tx.balance,
      };
    });
  } catch (error) {
    console.error('getTransactionsByAccountId error:', error);
    return [];
  }
}
