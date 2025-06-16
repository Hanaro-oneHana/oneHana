import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';
import AccountCard, { SubAccount, MainAccount } from '@/components/AccountCard';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export default async function Home() {

  const session = await auth();
  const userId = Number(session?.user?.id);

  const accounts = (await prisma.account.findMany({
    where: { user_id: userId },
    orderBy: { type: 'asc' }, // type 0(입출금)이 가장 먼저
  })) as {
    type: number;
    account: string;
    balance: number;
  }[];

  const main = accounts.find((acc) => acc.type === 0);
  const subs = accounts.filter((acc) => acc.type !== 0);

  const mainAccount: MainAccount = {
    type: 0,
    account: main?.account || '없음',
    balance: main?.balance || 0,
  };

  const subAccounts: SubAccount[] = subs.map((acc) => ({
    type: acc.type as 1 | 2 | 3,
    balance: acc.balance,
  }));


  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <BottomNavigation selectedItem='home' />
      <AccountCard
      userId={userId}
      mainAccount={mainAccount}
      subAccounts={subAccounts}
    />
    </>
  );
}