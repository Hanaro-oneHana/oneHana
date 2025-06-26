'use client';

import { Txt } from '@/components/atoms';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Account,
  AccountType,
  accountTypeLabelMap,
  Transaction,
} from '@/types/Account';
import Image from 'next/image';
import { useState } from 'react';
import { formatDateInAccountDetail } from '@/lib/utils';
import { AccountCardDetail } from '@/components/account';

type Props = {
  account: Account;
  allAccounts: Account[];
  allTransactions: { [key: number]: Transaction[] };
};

export default function AccountDetail({
  account,
  allAccounts,
  allTransactions,
}: Props) {
  const [selectedType, setSelectedType] = useState<AccountType>(account.type);

  const currentAccount =
    allAccounts.find((a) => a.type === selectedType) || account;
  const currentTransactions = allTransactions[currentAccount.id] || [];

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  return (
    <div className='flex h-[calc(100vh-70px)] w-full flex-col'>
      <AccountCardDetail
        type={currentAccount.type}
        account={currentAccount.account}
        balance={
          currentTransactions.length > 0
            ? currentTransactions[0].balance
            : currentAccount.balance
        }
        accountId={currentAccount.id}
      />

      <div className='flex justify-end py-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='text-textgray border-linegray flex cursor-pointer items-center rounded-[10px] border px-2 py-[2px]'>
              <Txt size='text-[15px]' weight='font-[500]' color='text-icon'>
                {accountTypeLabelMap[selectedType]}
              </Txt>
              <Image
                src='/asset/icons/down-shevron.svg'
                alt='DownShevron'
                width={20}
                height={20}
                className='ml-1'
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {allAccounts.map((acc) => (
              <DropdownMenuItem
                key={acc.type}
                onClick={() => setSelectedType(acc.type)}
              >
                <Txt
                  size='text-[15px]'
                  weight='font-[500]'
                  color='text-icon'
                  className='w-full text-right'
                >
                  {accountTypeLabelMap[acc.type]}
                </Txt>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 내역 스크롤 영역 */}
      <div className='scrollbar-hide overflow-y-auto'>
        {currentTransactions.map((transaction, index) => (
          <div key={transaction.id}>
            {(index === 0 ||
              currentTransactions[index - 1].date !== transaction.date) && (
              <div className='border-buttongray border-b py-2'>
                <Txt
                  size='text-[12px]'
                  weight='font-[600]'
                  color='text-textgray'
                >
                  {formatDateInAccountDetail(transaction.date)}
                </Txt>
              </div>
            )}

            <div className='border-linegray border-b py-2'>
              <div className='flex'>
                <div className='flex-1'>
                  <Txt
                    size='text-[8px]'
                    color='text-buttongray'
                    weight='font-[500]'
                  >
                    {formatTime(transaction.time)}
                  </Txt>

                  <div>
                    <Txt
                      size='text-[15px]'
                      weight='font-[600]'
                      color='text-textgray'
                    >
                      {transaction.description}
                    </Txt>
                  </div>

                  <Txt
                    size='text-[10px]'
                    color='text-buttongray'
                    weight='font-[500]'
                  >
                    {transaction.type}
                  </Txt>
                </div>

                <div className='flex flex-col items-end justify-center'>
                  <Txt
                    size='text-[15px]'
                    weight='font-[600]'
                    color={
                      transaction.amount > 0 ? 'text-primarycolor' : 'text-red'
                    }
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount.toLocaleString()} 원
                  </Txt>

                  <Txt
                    weight='font-[500]'
                    size='text-[10px]'
                    color='text-textgray'
                  >
                    {transaction.balance.toLocaleString()} 원
                  </Txt>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
