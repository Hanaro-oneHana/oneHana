import { Color } from '@/app/theme';
import { tr } from 'date-fns/locale';
import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  size?: `text-[${number}px]`;
  color?: `text-${Color}`;
  weight?: `font-[${number}]`;
  height?: `leading-${number}px`;
  align?: 'text-left' | 'text-center' | 'text-right';
};

export default function Txt({
  size = 'text-[16px]',
  className,
  children,
  color = 'text-mainblack',
  weight = 'font-[400]',
  height,
  align = 'text-left',
}: PropsWithChildren<Props>) {
  return (
    <span
      className={cn(
        `bg-transparent ${size} ${color} ${weight} align font-hana 
        ${height}
        ${className}`
      )}
    >
      {children}
    </span>
  );
}
