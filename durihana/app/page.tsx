import AccountCard, { SubAccount, MainAccount } from '@/components/AccountCard';
import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';
import { getAccountsByUserId } from '@/lib/actions/AccountActions';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();
  const userId = Number(session?.user?.id);
  const accounts = await getAccountsByUserId(userId);
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
