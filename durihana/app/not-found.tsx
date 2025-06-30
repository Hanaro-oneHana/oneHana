'use client';

import { Button, Txt } from '@/components/atoms';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='h-dvh flex flex-col items-center justify-between bg-background text-center pt-[200px] px-[20px] pb-[40px]'>
      <Image
        src='/asset/icons/page404.png'
        alt='Not Found'
        width={250}
        height={250}
      />
      <Txt align='text-center'>
        요청하신 페이지가
        <br /> 존재하지 않거나 이동되었어요.
      </Txt>
      <Button onClick={() => router.push('/')}>홈으로 돌아가기</Button>
    </div>
  );
}
