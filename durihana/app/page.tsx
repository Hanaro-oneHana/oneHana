import AccountCard, { SubAccount, MainAccount } from '@/components/AccountCard';
import AccountCardDefault from '@/components/AccountCardDefault';
import { Header, BottomNavigation } from '@/components/atoms';
import HouseLoanCard from '@/components/main/HouseLoanCard';
import MainDashBoard from '@/components/main/MainDashboard';
import PopularPartner from '@/components/main/PopularPartner';
import { getAccountsByUserId } from '@/lib/actions/AccountActions';
import {
  getCategoriesByUserId,
  getMarriageDate,
} from '@/lib/actions/DashboardActions';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!session?.user) {
    return (
      <div className='flex flex-col h-screen pt-[70px] px-[20px]'>
        <Header leftIcon='my' rightIcon='bell' />
        <BottomNavigation selectedItem='home' />
        <AccountCardDefault />
        <div className='pt-[30px]'>
          <MainDashBoard date='' category={['']} />
        </div>
        <div className='pt-[17px]'>
          <HouseLoanCard />
        </div>
        <div className='pt-[40px] pb-[105px]'>
          <PopularPartner />
        </div>
      </div>
    );
  }

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

  const marriageDate = await getMarriageDate(userId);
  const completedCategory = await getCategoriesByUserId(userId);
  console.log('🚀 ~ Home ~ completedCategory:', completedCategory);
  return (
    <div className='flex flex-col h-screen pt-[70px] px-[20px]'>
      <Header leftIcon='my' rightIcon='bell' />
      <BottomNavigation selectedItem='home' />
      {isAccountEmpty || !mainAccount ? (
        <AccountCardDefault />
      ) : (
        <AccountCard
          userId={userId}
          mainAccount={mainAccount}
          subAccounts={subAccounts}
        />
      )}
      <div className='pt-[30px]'>
        <MainDashBoard date={marriageDate} category={completedCategory} />
      </div>
      <div className='pt-[17px]'>
        <HouseLoanCard />
      </div>
      <PopularPartner />
    </div>
  );
}
