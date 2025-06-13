'use client';

import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Txt';

type AccountCardProps = {
  signUp?: () => void;
};

export default function AccountCardDefault({ signUp }: AccountCardProps) {
  return (
    <div className='bg-mint rounded-xl px-6 py-6 flex flex-col items-center justify-center m-2'>
      <Txt size='text-[15px]' weight='font-[500]' color='text-icon'>
        하나은행 입출금 통장이 없다면?
      </Txt>
      <Txt size='text-[22px]' weight='font-[600]' className='mb-6'>
        모바일 전용 통장
      </Txt>
      <Button onClick={signUp}>
        <Txt weight='font-[500]'>
          가입하기
        </Txt>
      </Button>
    </div>
  );
}

