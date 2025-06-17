'use client';

import Txt from '@/components/atoms/Txt';
import Image from 'next/image';
import Button from './atoms/Button';

type AccountType = 0 | 1 | 2 | 3; // 0:입출금, 1:예금, 2:적금, 3:대출

type Props = {
  type: AccountType;
  account: string;
  balance: number;
};

// 계좌 유형 라벨
const accountTypeLabelMap = {
  0: '두리함께입출금통장',
  1: '두리함께예금통장',
  2: '두리함께적금통장',
  3: '두리함께대출통장',
};

// 계좌 유형별 버튼 설정
const renderButtonsByType = (type: AccountType) => {
  switch (type) {
    case 0:
      return (
        <Button className='py-2'>
          <Txt size='text-[14px]' weight='font-[600]' color='text-mainwhite'>
            이체
          </Txt>
        </Button>
      );
    case 2:
      return (
        <Button className='py-2'>
          <Txt size='text-[14px]' weight='font-[600]' color='text-mainwhite'>
            입금
          </Txt>
        </Button>
      );
    case 3:
      return (
        <Button className='py-2'>
          <Txt size='text-[14px]' weight='font-[600]' color='text-mainwhite'>
            대출 상환
          </Txt>
        </Button>
      );
    default:
      return null;
  }
};

export default function AccountCardDetail({ type, account, balance }: Props) {
  return (
    <div className='relative bg-lightmint border border-borderline rounded-[10px] p-6'>
      <div className='absolute right-5'>
        <Image src='/asset/icons/info.svg' alt='info' width={24} height={24} />
      </div>

      <div>
        <Txt weight='font-[600]'>{accountTypeLabelMap[type]}</Txt>
        <Txt
          weight='font-[500]'
          size='text-[13px]'
          color='text-icon'
          className='mb-2 block'
        >
          {account}
        </Txt>
      </div>

      <div className='text-right mb-4'>
        <Txt size='text-[24px]' weight='font-[600]'>
          {balance.toLocaleString()} 원
        </Txt>
      </div>

      <div className='flex justify-start'>{renderButtonsByType(type)}</div>
    </div>
  );
}
