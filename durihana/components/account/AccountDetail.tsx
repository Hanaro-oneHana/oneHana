'use client';

import Txt from '@/components/atoms/Txt';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { useState } from 'react';
import AccountCardDetail from './AccountCardDetail';

export type AccountType = 0 | 1 | 2 | 3;

export type Account = {
  id: number;
  account: string;
  balance: number;
  type: AccountType;
  expire_date: string | null;
  transfer_date: string | null;
  payment: number | null;
  user_id: number;
};

export type Transaction = {
  id: number;
  date: string;
  time: string;
  description: string;
  type: string;
  amount: number;
  balance: number;
};

const accountTypeLabelMap = {
  0: '두리함께입출금통장',
  1: '두리함께예금통장',
  2: '두리함께적금통장',
  3: '두리함께대출통장',
};

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[date.getDay()];
    return `${year}.${month}.${day} (${dayName})`;
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  // 중복된 type 제거 (Set으로 처리)
  const uniqueAccountTypes = Array.from(
    new Set(allAccounts.map((acc) => acc.type))
  ) as AccountType[];

  return (
    <div className='flex flex-col h-[calc(100vh-60px)]'>
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
            <div className='cursor-pointer border px-2 py-[2px] rounded-[10px] text-textgray border-linegray flex items-center'>
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
            {uniqueAccountTypes.map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => setSelectedType(type)}
              >
                <Txt
                  size='text-[15px]'
                  weight='font-[500]'
                  color='text-icon'
                  className='text-right w-full'
                >
                  {accountTypeLabelMap[type]}
                </Txt>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 내역 스크롤 영역 */}
      <div className='flex-1 overflow-y-auto'>
        {currentTransactions.map((transaction, index) => (
          <div key={transaction.id}>
            {(index === 0 ||
              currentTransactions[index - 1].date !== transaction.date) && (
              <div className='py-2 border-b border-buttongray'>
                <Txt
                  size='text-[12px]'
                  weight='font-[600]'
                  color='text-textgray'
                >
                  {formatDate(transaction.date)}
                </Txt>
              </div>
            )}

            <div className='py-2 border-b border-linegray'>
              <div className='flex'>
                <div className='flex-1'>
                  <div>
                    <Txt
                      size='text-[8px]'
                      color='text-buttongray'
                      weight='font-[500]'
                    >
                      {formatTime(transaction.time)}
                    </Txt>
                  </div>
                  <div>
                    <Txt
                      size='text-[15px]'
                      weight='font-[600]'
                      color='text-textgray'
                    >
                      {transaction.description}
                    </Txt>
                  </div>
                  <div>
                    <Txt
                      size='text-[10px]'
                      color='text-buttongray'
                      weight='font-[500]'
                    >
                      {transaction.type}
                    </Txt>
                  </div>
                </div>

                <div className='flex flex-col justify-center items-end'>
                  <div>
                    <Txt
                      size='text-[15px]'
                      weight='font-[600]'
                      color={
                        transaction.amount > 0
                          ? 'text-primarycolor'
                          : 'text-red'
                      }
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount.toLocaleString()} 원
                    </Txt>
                  </div>

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
