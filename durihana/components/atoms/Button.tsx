'use client';

import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type Props = {
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  bgColor?: 'primarycolor' | 'mint' | 'mainblack' | 'mainwhite';
  textColor?: 'mainwhite' | 'mainblack';
};

export default function Button({
  bgColor = 'primarycolor',
  textColor = 'mainwhite',
  onClick,
  type = 'button',
  children,
}: PropsWithChildren<Props>) {
  return (
    <button
      className={clsx(`bg-${bgColor} text-${textColor} justify-center items-center font-hana font-medium rounded-[10px] cursor-pointer w-full py-[14px] 
         `)}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
