import { Color, fontWeights } from '@/app/theme';
import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  size?: number;
  color?: Color;
  weight?: keyof typeof fontWeights;
  height?: number;
  align?: 'left' | 'center' | 'right';
};

export default function Txt({
  size = 16,
  className,
  children,
  color = 'mainBlack',
  weight = 'regular',
  height,
  align = 'left',
}: PropsWithChildren<Props>) {
  return (
    <span
      className={cn(
        `text-[${size}px] text-${color} text-${align} font-hana font-[${fontWeights[weight]}] ${height ? `leading-[${height}px]` : ''} `,
        className
      )}
    >
      {children}
    </span>
  );
}
