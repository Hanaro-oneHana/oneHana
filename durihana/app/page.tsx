import AccountCard, { SubAccount, MainAccount } from '@/components/AccountCard';
import AccountCardDefault from '@/components/AccountCardDefault';
import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';
import { getAccountsByUserId } from '@/lib/actions/AccountActions';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  const accounts = await getAccountsByUserId(userId);

  const isAccountEmpty = !accounts || accounts.length === 0;

  let mainAccount: MainAccount | null = null;
  let subAccounts: SubAccount[] = [];

  if (!isAccountEmpty) {
    const main = accounts.find((acc) => acc.type === 0);
    const subs = accounts.filter((acc) => acc.type !== 0);

    if (main) {
      mainAccount = {
        type: 0,
        account: main.account,
        balance: main.balance,
      };
    }

    subAccounts = subs.map((acc) => ({
      type: acc.type as 1 | 2 | 3,
      balance: acc.balance,
    }));
  }

  return (
    <div className='flex flex-col h-screen pt-[70px] px-[20px]'>
      <Header leftIcon='my' rightIcon='bell' />
      <BottomNavigation selectedItem='home' />
      {(session && !session.user) || isAccountEmpty || !mainAccount ? (
        /* 로그인 안 되거나 계좌가 없는 경우 기본 계좌 카드 표시 */
        <AccountCardDefault />
      ) : (
        /* 로그인 된 경우 계좌 정보 표시 */
        <AccountCard
          userId={userId}
          mainAccount={mainAccount}
          subAccounts={subAccounts}
        />
      )}
    </div>
  );
}
