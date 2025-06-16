'use client';

import Txt from '@/components/atoms/Txt';
import { useRouter } from 'next/navigation';

export type SubAccount = {
  type: 1 | 2 | 3; // 1:예금, 2:적금, 3:대출
  balance: number;
};

export type MainAccount = {
  type: 0;
  account: string;
  balance: number;
};

type Props = {
  userId: number;
  mainAccount: MainAccount;
  subAccounts: SubAccount[];
};

// type에 따른 통장 이름 매핑
export const accountTypeLabelMap = {
  0: '두리함께입출금통장',
  1: '두리함께예금통장',
  2: '두리함께적금통장',
  3: '두리함께대출통장',
};

export default function AccountCard({
  userId,
  mainAccount,
  subAccounts,
}: Props) {
  const router = useRouter();

  const onCardClick = () => {
    router.push(`/account/detail/${userId}`);
  };

  return (
    <div
      className='relative bg-lightmint border border-borderline rounded-xl p-6 m-2'
      onClick={onCardClick}
    >
      <div className='absolute text-navy right-6 top-5 text-xl'>•••</div>

      <div>
        <Txt size='text-[18px]' weight='font-[600]'>
          {accountTypeLabelMap[mainAccount.type]}
        </Txt>
        <Txt size='text-[18px]' color='text-icon' className='mb-4 block'>
          {mainAccount.account}
        </Txt>
      </div>

      <div className='text-right'>
        <Txt size='text-[30px]' weight='font-[500]'>
          {mainAccount.balance.toLocaleString()} 원
        </Txt>
      </div>

      <div className='flex flex-col gap-2 mt-3'>
        {subAccounts.map((item) => (
          <div key={item.type} className='flex justify-between items-center'>
            <div className='bg-primarycolor px-[10px] py-[5px] rounded-2xl text-[14px] font-hana font-[500] text-white select-none inline-block whitespace-nowrap'>
              {accountTypeLabelMap[item.type]}
            </div>
            <Txt
              size='text-[22px]'
              color='text-icon'
              className='text-right min-w-[90px]'
            >
              {item.balance.toLocaleString()}원
            </Txt>
          </div>
        ))}
      </div>
    </div>
  );
}
