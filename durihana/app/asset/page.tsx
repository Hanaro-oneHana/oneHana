import AccountCard, { MainAccount, SubAccount } from '@/components/AccountCard';
import AssetOverview from '@/components/asset/AssetOverview';
import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';
import { getAccountsByUserId } from '@/lib/actions/AccountActions';
import { auth } from '@/lib/auth';

// const PieChartComponent = dynamic(
//   () => import('@/components/asset/AssetChart'),
//   {
//     ssr: false,
//   }
// );

export default async function Asset() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!session?.user) {
    return <>사용자가 없습니다</>;
  }

  const accounts = await getAccountsByUserId(userId);
  const main = accounts.find((acc) => acc.type === 0)!;
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

  const data = [
    { name: '예식장', value: 4200000 },
    { name: '신혼여행', value: 5000000 },
    { name: '스드메', value: 2300000 },
    { name: '가전·가구', value: 1500000 },
    { name: '예물', value: 1100000 },
  ];
  const total = 20000000;

  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <div className='flex flex-col px-[20px]'>
        <div className='mt-[70px]'>
          <AccountCard
            userId={userId}
            mainAccount={mainAccount}
            subAccounts={subAccounts}
          />
        </div>
        <div className='mb-[75px]'>
          <AssetOverview data={data} balance={total} />
        </div>
      </div>

      <BottomNavigation selectedItem='asset' />
    </>
  );
}
