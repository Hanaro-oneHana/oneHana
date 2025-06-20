import Image from 'next/image';
import { Txt } from '../atoms';

export default function HouseLoanCard() {
  return (
    <div className='bg-purple rounded-xl h-[71px] flex justify-center'>
      <div className='flex flex-col justify-center gap-[4px] mr-5'>
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
        className='ml-4 mr-[-13px]'
      />
    </div>
  );
}
