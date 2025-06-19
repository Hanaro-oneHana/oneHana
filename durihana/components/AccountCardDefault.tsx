'use client';

import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Txt';
import { useRouter } from 'next/navigation';

type AccountCardProps = {
  signUp?: () => void;
};

export default function AccountCardDefault({ signUp }: AccountCardProps) {
  const router = useRouter();

  const goToSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <div className='bg-lightmint rounded-[10px] border border-borderline px-6 py-6 flex flex-col items-center justify-center'>
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
