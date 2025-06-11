import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  gap?: string;
};

export default function HorizontalSlider({
  children,
  className,
  gap = 'gap-[10px]',
}: PropsWithChildren<Props>) {
  return (
    <div
      className={cn(
        'overflow-x-auto scrollbar-hide scroll-smooth w-full',
        className
      )}
    >
      <div className={cn('flex w-max', gap)}>{children}</div>
    </div>
  );
}
