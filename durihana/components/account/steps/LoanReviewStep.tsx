import Txt from '@/components/atoms/Txt';
import Image from 'next/image';

export default function LoanReviewStep() {
  return (
    <div className='flex-1 px-6 py-8 flex flex-col items-center justify-center'>
      <Txt size='text-[22px]' className='text-mainblack mb-16'>
        두리아나대출통장
      </Txt>

      <div className='flex-1 flex flex-col items-center justify-center'>
        <Image
          src='/asset/icons/loan.svg'
          alt='location'
          width={200}
          height={200}
        />

        <Txt size='text-[16px]' className='text-mainblack mb-2'>
          대출 승인 심사가 신청되었습니다
        </Txt>
        <Txt size='text-[10px]' className='text-icongray text-center'>
          영업일 기준 1~3일 이내 승인
        </Txt>
      </div>
    </div>
  );
}
