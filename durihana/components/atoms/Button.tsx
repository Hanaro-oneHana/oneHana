'use client';

import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  bgColor?: 'primarycolor' | 'mint' | 'icon' | 'purple';
  textColor?: 'mainwhite' | 'mainblack';
};

export default function Button({
  className,
  bgColor = 'primarycolor',
  textColor = 'mainwhite',
  onClick,
  type = 'button',
  children,
}: PropsWithChildren<Props>) {
  return (
    <button
      className={cn(
        `bg-${bgColor} text-${textColor} justify-center items-center font-hana font-medium rounded-[10px] cursor-pointer w-full py-[15px] 
         `,
        className
      )}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
