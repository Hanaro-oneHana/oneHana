import AccountDetail, { Transaction } from '@/components/account/AccountDetail';
import AccountDetailHeader from '@/components/account/AccountDetailHeader';
import Container from '@/components/containers/Container';
import { use } from 'react';
import {
  getAllAccountsByUserId,
  getFirstAccountByUserId,
} from '@/lib/actions/AccountActions';
import {
  getTransactionsByAccountId,
  getMinusTransactionsByAccountId,
} from '@/lib/actions/TransactionActions';
import { auth } from '@/lib/auth';

export default function AccountDetailPage() {
  const session = use(auth());
  const userId = Number(session?.user?.id);
  const allAccounts = use(getAllAccountsByUserId(userId));
  const firstAccount = use(getFirstAccountByUserId(userId));

  const allTransactions: { [key: number]: Transaction[] } = {};

  for (const acc of allAccounts) {
    const deposits = use(getTransactionsByAccountId(acc.id));
    const withdrawals = use(getMinusTransactionsByAccountId(acc.id));

    const merged = [...deposits, ...withdrawals].sort((a, b) => {
      const aTime = new Date(`${a.date} ${a.time}`).getTime();
      const bTime = new Date(`${b.date} ${b.time}`).getTime();
      return bTime - aTime; // 최신순 정렬
    });

    allTransactions[acc.id] = merged;
  }

  if (!firstAccount) return <div>계좌를 찾을 수 없습니다.</div>;

  return (
    <>
      <Container
        className='flex flex-col pt-[70px]'
        header={<AccountDetailHeader />}
      >
        <AccountDetail
          account={firstAccount}
          allAccounts={allAccounts}
          allTransactions={allTransactions}
        />
      </Container>
    </>
  );
}
