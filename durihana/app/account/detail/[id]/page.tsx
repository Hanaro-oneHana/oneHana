import AccountDetail, { Transaction } from '@/components/AccountDetail';
import AccountDetailHeader from '@/components/AccountDetailHeader';
import {
  getAllAccountsByUserId,
  getFirstAccountByUserId,
} from '@/lib/actions/AccountActions';
import { getTransactionsByAccountId } from '@/lib/actions/TransactionActions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AccountDetailPage({ params }: Props) {
  const userId = await params;
  const allAccounts = await getAllAccountsByUserId(Number(userId.id));
  const firstAccount = await getFirstAccountByUserId(Number(userId.id));

  const allTransactions: { [key: number]: Transaction[] } = {};
  for (const acc of allAccounts) {
    allTransactions[acc.id] = await getTransactionsByAccountId(acc.id);
  }

  if (!firstAccount) return <div>계좌를 찾을 수 없습니다.</div>;

  return (
    <>
      <AccountDetailHeader />
      <div className='flex flex-col p-[20px]'>
        <AccountDetail
          account={firstAccount}
          allAccounts={allAccounts}
          allTransactions={allTransactions}
        />
      </div>
    </>
  );
}
