'use client';

import { Button, Txt } from '@/components/atoms';
import { useRouter } from 'next/navigation';

export default function AccountCardDefault() {
  const router = useRouter();

  const goToSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <div className='bg-lightmint border-linegray flex flex-col items-center justify-center rounded-[10px] border px-6 py-6'>
      <Txt color='text-icon' className='mb-[10px]'>
        하나은행 입출금 통장이 없다면?
      </Txt>
      <Txt size='text-[20px]' weight='font-[600]' className='mb-6'>
        모바일 전용 통장
      </Txt>
      <Button onClick={goToSignUp}>
        <Txt weight='font-[500]' color='text-mainwhite' align='text-center'>
          가입하기
        </Txt>
      </Button>
    </div>
  );
}
