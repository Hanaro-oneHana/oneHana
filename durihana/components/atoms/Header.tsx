'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Button from './Button';
import Txt from './Txt';

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
    <>
      <header className='fixed top-0 left-[50%] translate-x-[-50%] max-w-[960px] flex w-dvw items-center justify-between h-[60px] bg-background z-50 px-[20px]'>
        <div className='flex items-center justify-center  gap-[10px] bg-transparent '>
          <button
            className='flex items-center justify-center w-[24px] h-[24px] shrink-0 cursor-pointer'
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
              className='flex text-[11px] py-[4px] px-[8px] rounded-[8px] '
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
          className='w-[24px] h-[24px]cursor-pointer bg-transparent'
          onClick={onRightClick}
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
    </>
  );
}
