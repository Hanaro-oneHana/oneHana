'use client';

import { Input } from '@/components/ui/input';
import { ChangeEvent, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: 'name' | 'email' | 'password' | 'tel' | 'marry_date';
  text?: string;
  width?: string;
  className?: string;
}
export default function InputComponent({
  label,
  text,
  width = 'w-full',
  className,
  onChange,
  ...rest
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');

    if (label === 'tel') {
      // 전화번호
      const numeric = raw.slice(0, 11);
      const len = numeric.length;

      if (len <= 3) {
        e.target.value = numeric;
      } else if (len <= 7) {
        e.target.value = `${numeric.slice(0, 3)}-${numeric.slice(3)}`;
      } else {
        e.target.value = `${numeric.slice(0, 3)}-${numeric.slice(3, 7)}-${numeric.slice(7)}`;
      }
    } else if (label === 'marry_date') {
      //결혼날짜(YYYY-MM)
      const num = raw.slice(0, 6);
      if (num.length <= 4) {
        e.target.value = num;
      } else {
        e.target.value = `${num.slice(0, 4)}-${num.slice(4)}`;
      }
    }
  };

  return (
    <Input
      {...rest}
      placeholder={text}
      className={cn(
        `h-10 ${width} bg-transparent focus:outline-none border-b placeholder-[#666666] `,
        className
      )}
      onChange={handleChange}
    />
  );
}
