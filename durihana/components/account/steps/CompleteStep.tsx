import Txt from '@/components/atoms/Txt';
import Image from 'next/image';

export default function CompleteStep() {
  return (
    <div className='flex-1 px-6 py-8 flex flex-col items-center justify-center'>
      <div className='flex-1 flex flex-col items-center justify-center'>
        <Image
          src='/asset/icons/create-account-complete.png'
          alt='location'
          width={200}
          height={200}
        />
        <Txt
          size='text-[16px]'
          weight='font-[400]'
          className='text-mainblack text-center mb-4'
        >
          상품 가입이 모두 완료됐습니다
        </Txt>
      </div>
    </div>
  );
}
