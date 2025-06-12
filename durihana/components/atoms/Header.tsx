'use client';

import Image from 'next/image';
import Button from './Button';
import Txt from './Txt';

type Props = {
  title?: string;
  leftIcon: 'back' | 'my';
  rightIcon?: 'close' | 'bell';
  buttonTxt?: '로그인' | '로그아웃'; // 로그인 아니면 로그아웃
  onBackClick?: () => void; // 뒤로가기
  onMyClick?: () => void; // 사람 모양 아이콘
  onRightClick?: () => void; // 종 혹은 닫기
  onClick?: () => void; // 로그인 혹은 로그아웃의 Click 메소드
};

export default function Header({
  title,
  leftIcon,
  rightIcon,
  buttonTxt = '로그인',
  onBackClick,
  onMyClick,
  onRightClick,
  onClick,
}: Props) {
  const isLeftBack = leftIcon === 'back';
  const isRightClose = rightIcon === 'close';
  const imageLeftUrl = `/asset/icons/${leftIcon}.svg`;
  const imageRightUrl = `/asset/icons/${rightIcon}.svg`;

  return (
    <>
      <header className='flex items-center justify-between h-[60px] bg-transparent'>
        <div className='flex items-center gap-2 bg-transparent'>
          <button
            className=' ml-4 cursor-pointer '
            onClick={isLeftBack ? onBackClick : onMyClick}
          >
            <Image
              src={imageLeftUrl}
              alt={isLeftBack ? '뒤로가기' : '마이'}
              width={isLeftBack ? 10 : 20}
              height={20}
              className='bg-transparent'
            />
          </button>
          {leftIcon === 'my' && (
            <Button className='flex h-[20px] text-xs p-2' onClick={onClick}>
              {buttonTxt}
            </Button>
          )}
        </div>

        <Txt> {title} </Txt>

        <button
          className='w-[24px] h-[24px] mr-2 cursor-pointer bg-transparent'
          onClick={onRightClick}
        >
          {rightIcon && (
            <Image
              src={imageRightUrl}
              alt={isRightClose ? '닫기' : '알림'}
              width={15}
              height={15}
              className='bg-transparent'
            />
          )}
        </button>
      </header>
    </>
  );
}
