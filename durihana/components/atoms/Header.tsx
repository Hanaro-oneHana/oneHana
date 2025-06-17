'use client';

import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Button from './Button';
import Txt from './Txt';

type Props = {
  title?: string;
  leftIcon: 'back' | 'my';
  rightIcon?: 'close' | 'bell';
  onBackClick?: () => void; // 뒤로가기
  onMyClick?: () => void; // 사람 모양 아이콘
  onRightClick?: () => void; // 종 혹은 닫기
};

export default function Header({
  title,
  leftIcon,
  rightIcon,
  onBackClick,
  onMyClick,
  onRightClick,
}: Props) {
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
      <header className='flex w-full items-center justify-between h-[60px] bg-transparent px-[20px]'>
        <div className='flex items-center justify-center  gap-[10px] bg-transparent '>
          <button
            className='flex items-center justify-center w-[24px] h-[24px] shrink-0 cursor-pointer'
            onClick={isLeftBack ? onBackClick : onMyClick}
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
              className='flex text-[11px] py-[4px] px-[8px] rounded-[8px]'
              onClick={session?.user ? () => signOut() : () => signIn()}
            >
              {session?.user ? '로그아웃' : '로그인'}
            </Button>
          )}
        </div>

        <Txt> {title} </Txt>

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
