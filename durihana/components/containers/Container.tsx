import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export default function Container({
  children,
  className,
  header,
  footer,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={`relative flex h-dvh w-full flex-col items-start justify-start overflow-hidden`}
    >
      {header && (
        <div className='fixed top-0 left-[50%] z-50 w-dvw max-w-[960px] translate-x-[-50%]'>
          {header}
        </div>
      )}
      <div
        className={cn(
          `scrollbar-hide flex w-full flex-col items-start justify-start overflow-y-auto px-[20px]`,
          className
        )}
      >
        {children}
      </div>
      {footer && (
        <div className='fixed bottom-0 left-[50%] z-50 w-dvw max-w-[960px] translate-x-[-50%]'>
          {footer}
        </div>
      )}
    </div>
  );
}
