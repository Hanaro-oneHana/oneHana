import AccountCard, { MainAccount, SubAccount } from '@/components/AccountCard';
import AssetOverview from '@/components/asset/AssetOverview';
import { BottomNavigation, Header } from '@/components/atoms';
import { getAccountsByUserId } from '@/lib/actions/AccountActions';
import {
  getBucketTotalAmount,
  getTypeAmounts,
} from '@/lib/actions/AssetActions';
import { auth } from '@/lib/auth';

export default async function Asset() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  // 로그인 유저 없을 때 임시 처리. 추후 미들웨어 처리 예정
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

  const data = await getTypeAmounts(userId);

  const total = await getBucketTotalAmount(userId);
  console.log('🚀 ~ Asset ~ total:', total);

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
