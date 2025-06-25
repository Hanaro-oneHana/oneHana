import { AccountCard } from '@/components/account';
import { AssetOverview } from '@/components/asset';
import { BottomNavigation, Header } from '@/components/atoms';
import Container from '@/components/containers/Container';
import { MainAccount, SubAccount } from '@/types/Account';
import { use } from 'react';
import {
  getAccountsByUserId,
  getCoupleTotalBalance,
} from '@/lib/actions/AccountActions';
import {
  getBucketTotalAmount,
  getTypeAmounts,
} from '@/lib/actions/AssetActions';
import { auth } from '@/lib/auth';

export default function Asset() {
  const session = use(auth());
  const userId = Number(session?.user?.id);

  const accounts = use(getAccountsByUserId(userId));
  const main = accounts.data.find((acc) => acc.type === 0)!;
  const subs = accounts.data.filter((acc) => acc.type !== 0);

  const mainAccount: MainAccount = {
    type: 0,
    account: main.account,
    balance: main.balance,
  };

  const subAccounts: SubAccount[] = subs.map((acc) => ({
    type: acc.type as 1 | 2 | 3,
    balance: acc.balance,
  }));

  const coupleBalance = use(getCoupleTotalBalance(userId));

  const data = use(getTypeAmounts(userId));

  const total = use(getBucketTotalAmount(userId));

  return (
    <Container
      className='gap-[70px] pt-[70px] pb-[82.5px]'
      header={<Header leftIcon='my' rightIcon='bell' />}
      footer={<BottomNavigation selectedItem='asset' />}
    >
      <AccountCard
        userId={userId}
        mainAccount={mainAccount}
        subAccounts={subAccounts}
        coupleBalance={coupleBalance.data}
      />
      <AssetOverview data={data} balance={total} />
    </Container>
  );
}
