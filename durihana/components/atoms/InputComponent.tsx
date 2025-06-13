'use client';

import { Input } from '@/components/ui/input';
import { ChangeEvent, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  width?: string;
  className?: string;
}
export default function InputComponent({
  width = 'w-full',
  className,
  ...rest
}: Props) {
  return (
    <Input
      {...rest}
      className={cn(
        `h-10 ${width} bg-transparent focus:outline-none border-b placeholder-[#666666] `,
        className
      )}
    />
  );
}
