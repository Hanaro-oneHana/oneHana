'use client';

import { Button, Txt } from '@/components/atoms';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center justify-between h-dvh bg-background pt-[200px] px-[20px] pb-[40px]'>
      <Image
        src='/asset/icons/unauthorized.png'
        alt='Unauthorized Access'
        width={200}
        height={200}
      />
      <Txt align='text-center'>
        이 페이지를 보려면 로그인이 필요합니다.
        <br />
        로그인 페이지로 이동해 주세요.
      </Txt>
      <Button onClick={() => router.push('/auth/signin')}>
        로그인 하러 가기
      </Button>
    </div>
  );
}
