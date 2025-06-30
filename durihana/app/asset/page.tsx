import { AccountCard } from '@/components/account';
import { AssetOverview } from '@/components/asset';
import { BottomNavigation, Header } from '@/components/atoms';
import Container from '@/components/containers/Container';
import { SubAccount } from '@/types/Account';
import { use } from 'react';
import {
  getAccountsByUserId,
  getCoupleTotalBalance,
} from '@/lib/actions/AccountActions';
import {
  getBucketTotalAmount,
  getCategoryData,
} from '@/lib/actions/AssetActions';
import { getCoupleNames } from '@/lib/actions/getCoupleUserIds';
import { auth } from '@/lib/auth';

export default function Asset() {
  const session = use(auth());
  const userId = Number(session?.user?.id);

  const mainUserId = session?.user?.isMain
    ? Number(session.user.id)
    : Number(session?.user?.partnerId);

  const accounts = use(getAccountsByUserId(userId));
  const coupleNames = use(getCoupleNames(userId));
  const subs = accounts.data.filter((acc) => acc.type !== 0);

  const subAccounts: SubAccount[] = subs.map((acc) => ({
    type: acc.type as 1 | 2 | 3,
    balance: acc.balance,
  }));

  const coupleBalance = use(getCoupleTotalBalance(userId));

  const categoryDataResult = use(getCategoryData(mainUserId));
  const categoryData =
    categoryDataResult?.isSuccess && categoryDataResult.data
      ? categoryDataResult.data
      : [];

  const total = use(getBucketTotalAmount(mainUserId));

  return (
    <Container
      className='gap-[40px] pt-[70px] pb-[82.5px]'
      header={<Header leftIcon='my' rightIcon='bell' />}
      footer={<BottomNavigation selectedItem='asset' />}
    >
      <AccountCard
        userId={userId}
        subAccounts={subAccounts}
        coupleBalance={coupleBalance.data}
        coupleNames={coupleNames}
      />
      <AssetOverview data={categoryData} balance={total} />
    </Container>
  );
}
