'use client';

import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  bgColor?: 'bg-primarycolor' | 'bg-mint' | 'bg-icon' | 'bg-purple';
  textColor?: 'text-mainwhite' | 'text-mainblack';
  disabled?: boolean;
};

export default function Button({
  className,
  bgColor = 'bg-primarycolor',
  textColor = 'text-mainwhite',
  onClick,
  type = 'button',
  children,
  disabled = false,
}: PropsWithChildren<Props>) {
  return (
    <button
      className={cn(
        `${bgColor} ${textColor} justify-center items-center font-hana rounded-[10px] cursor-pointer w-full py-[12px] 
         `,
        className
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
