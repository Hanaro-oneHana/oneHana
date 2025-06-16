import AccountCard, { SubAccount, MainAccount } from '@/components/AccountCard';
import AccountCardDefault from '@/components/AccountCardDefault';
import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';
import { getAccountsByUserId } from '@/lib/actions/AccountActions';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  // 로그인 안 된 경우
  if (!session?.user) {
    return (
      <>
        <Header leftIcon='my' rightIcon='bell' />
        <BottomNavigation selectedItem='home' />
        <AccountCardDefault />
      </>
    );
  }

  // 로그인된 경우: 계좌 정보 가져오기
  const accounts = await getAccountsByUserId(userId);
  const main = accounts.find((acc) => acc.type === 0)!; // 입출금 통장은 반드시 있어야 함
  const subs = accounts.filter((acc) => acc.type !== 0);

  const mainAccount: MainAccount = {
    type: 0,
    account: main.account,
    balance: main.balance,
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
