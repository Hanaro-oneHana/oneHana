import { Txt } from '@/components/atoms';
import Image from 'next/image';

export default function HouseLoanCard() {
  return (
    <div className='bg-purple flex h-[71px] w-full justify-center rounded-xl'>
      <div className='mr-5 flex flex-col justify-center gap-[4px]'>
        <Txt size='text-[10px]' weight='font-[350]'>
          신혼집 자금이 걱정되면?
        </Txt>
        <Txt size='text-[15px]' weight='font-[600]'>
          신혼부부 전세대출 보러 가기
        </Txt>
      </div>
      <Image
        src='/asset/icons/house.svg'
        alt='전세대출 이미지'
        width={90}
        height={90}
        className='mr-[-13px] ml-4'
      />
    </div>
  );
}
