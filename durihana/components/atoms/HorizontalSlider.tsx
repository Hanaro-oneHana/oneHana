import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type HorizontalSliderProps = {
  children: ReactNode;
  className?: string;
};

export default function HorizontalSlider({
  children,
  className,
}: HorizontalSliderProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto scrollbar-hide scroll-smooth w-full',
        className
      )}
    >
      <div className='flex w-max gap-2'>{children}</div>
    </div>
  );
}
