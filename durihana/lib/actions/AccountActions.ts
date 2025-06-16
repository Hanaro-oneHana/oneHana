import prisma from '@/lib/db';

export async function getAccountsByUserId(userId: number) {
  try {
    const accounts = await prisma.account.findMany({
      where: { user_id: userId },
      orderBy: { type: 'asc' },
    });

    return accounts;
  } catch (error) {
    console.error('getAccountsByUserId error:', error);
    return [];
  }
}
