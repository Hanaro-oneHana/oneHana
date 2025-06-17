// app/account/detail/[id]/page.tsx
import AccountDetail from '@/components/AccountDetail';
import AccountDetailHeader from '@/components/AccountDetailHeader';
import {
  getAllAccountsByUserId,
  getFirstAccountByUserId,
} from '@/lib/actions/AccountActions';
import { getTransactionsByAccountId } from '@/lib/actions/TransactionActions';

type Props = {
  params: { id: string };
};

export default async function AccountDetailPage({ params }: Props) {
  const userId = Number(params.id);
  const allAccounts = await getAllAccountsByUserId(userId);
  const firstAccount = await getFirstAccountByUserId(userId);
  

  const allTransactions: { [key: number]: any[] } = {};
  for (const acc of allAccounts) {
    allTransactions[acc.id] = await getTransactionsByAccountId(acc.id);
  }

  if (!firstAccount) return <div>계좌를 찾을 수 없습니다.</div>;

  return (
    <>
      <AccountDetailHeader/>
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
