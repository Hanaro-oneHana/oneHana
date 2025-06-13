'use client';

import Button from '@/components/atoms/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Txt from './atoms/Txt';

export default function Onboarding() {
  const router = useRouter();

  return (
    <div className='flex flex-col min-h-screen justify-center items-center'>
      <div className='flex flex-col items-center'>
        <Txt className='self-start'>두 사람, 하나의 여정</Txt>
        <div className='mb-2'>
          <Txt size='text-[36px]' weight='font-[500]'>
            두리하나
          </Txt>
        </div>
        <Image
          src='/asset/icons/onboarding.svg'
          alt='두리하나 온보딩'
          width={180}
          height={180}
          className='mb-8'
          priority
        />
        <Button onClick={() => router.push('/auth/login')}>
          <Txt size='text-[20px]'>시작하기</Txt>
        </Button>
      </div>
    </div>
  );
}
