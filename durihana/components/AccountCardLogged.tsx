'use client';

import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Txt';

type AccountCardLoggedInProps = {
  accountType: 'deposit' | 'loan';
  accountNumber: string;
  balance: number;
};

export default function AccountCardLoggedIn({
  accountNumber,
  balance,
  accountType,
}: AccountCardLoggedInProps) {
  const title =
    accountType === 'deposit' ? '두리함께예금통장' : '하나멤버스주거래통장';

  return (
    <div className='bg-mint rounded-xl px-6 pt-6 pb-4 flex-col m-2'>
      <div>
        <Txt size='text-[18px]' weight='font-[500]'>
          {title}
        </Txt>
        <div>
          <Txt size='text-[15px]' color='text-icon'>
            {accountType === 'deposit' ? '예금' : '대출'} {accountNumber}
          </Txt>
        </div>
        <div className='mb-4'>
          <Txt size='text-[22px]' weight='font-[600]'>
            {balance.toLocaleString()} 원
          </Txt>
        </div>
      </div>
      <div className='mt-2 flex justify-end'>
        <Button className='w-1/3 min-w-[110px] max-w-[160px]'>
          <Txt weight='font-[500]'>보내기</Txt>
        </Button>
      </div>
    </div>
  );
}
