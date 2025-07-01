'use client';

import { Button, Txt } from '@/components/atoms';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Props = {
  title?: string;
  leftIcon: 'back' | 'my';
  rightIcon?: 'close' | 'bell';
  onLeftClick?: () => void; // 뒤로가기 혹은 마이
  onRightClick?: () => void; // 종 혹은 닫기
};

export default function Header({
  title,
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
}: Props) {
  const router = useRouter();
  const [isLeftBack, setLeftBack] = useState(leftIcon === 'back');
  const [isRightClose, setRightClose] = useState(rightIcon === 'close');
  const { data: session } = useSession();
  const imageLeftUrl = `/asset/icons/${leftIcon}.svg`;
  const imageRightUrl = `/asset/icons/${rightIcon}.svg`;

  useEffect(() => {
    setLeftBack(leftIcon === 'back');
    setRightClose(rightIcon === 'close');
  }, [leftIcon, rightIcon]);

  return (
    <header className='bg-background flex h-[60px] w-full items-center justify-between px-[20px]'>
      <div className='flex items-center justify-center gap-[10px] bg-transparent'>
        <button
          className='flex h-[24px] w-[24px] shrink-0 cursor-pointer items-center justify-center'
          onClick={
            onLeftClick
              ? onLeftClick
              : () => {
                  if (isLeftBack) {
                    router.back();
                  } else {
                    router.push('/my');
                  }
                }
          }
        >
          <Image
            src={imageLeftUrl}
            alt={isLeftBack ? '뒤로가기' : '마이'}
            width={isLeftBack ? 20 : 24}
            height={isLeftBack ? 20 : 24}
            className='bg-transparent'
          />
        </button>
        {leftIcon === 'my' && (
          <Button
            className='flex rounded-[8px] px-[8px] py-[4px] text-[11px]'
            onClick={session?.user ? () => signOut() : () => signIn()}
          >
            {session?.user ? '로그아웃' : '로그인'}
          </Button>
        )}
      </div>

      <Txt align='text-center' size='text-[16px]' weight='font-[500]'>
        {title}
      </Txt>

      <button
        className='h-[24px] w-[24px] cursor-pointer bg-transparent'
        onClick={onRightClick ? onRightClick : () => router.back()}
      >
        {rightIcon && (
          <Image
            src={imageRightUrl}
            alt={isRightClose ? '닫기' : '알림'}
            width={24}
            height={24}
            className='bg-transparent'
          />
        )}
      </button>
    </header>
  );
}
