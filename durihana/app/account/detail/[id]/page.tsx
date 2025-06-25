import AccountDetail, { Transaction } from '@/components/account/AccountDetail';
import AccountDetailHeader from '@/components/account/AccountDetailHeader';
import {
  getAllAccountsByUserId,
  getFirstAccountByUserId,
} from '@/lib/actions/AccountActions';
import {
  getTransactionsByAccountId,
  getMinusTransactionsByAccountId,
} from '@/lib/actions/TransactionActions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AccountDetailPage({ params }: Props) {
  const userId = await params;
  const allAccounts = await getAllAccountsByUserId(Number(userId.id));
  const firstAccount = await getFirstAccountByUserId(Number(userId.id));

  const allTransactions: { [key: number]: Transaction[] } = {};

  for (const acc of allAccounts) {
    const deposits = await getTransactionsByAccountId(acc.id);
    const withdrawals = await getMinusTransactionsByAccountId(acc.id);

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
      <AccountDetailHeader />
      <div className='mt-[60px] flex flex-col p-[20px]'>
        <AccountDetail
          account={firstAccount}
          allAccounts={allAccounts}
          allTransactions={allTransactions}
        />
      </div>
    </>
  );
}
