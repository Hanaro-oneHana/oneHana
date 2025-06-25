'use client';

import { cn } from '@/lib/utils';
import Button from '../atoms/Button';

type CalendarDayProps = {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isBlocked: boolean;
  hasFinanceSchedule: boolean;
  hasReservationSchedule: boolean;
  showScheduleDots: boolean;
  onDateSelect: (date: Date) => void;
  variant?: 'page' | 'drawer';
};

export default function CalendarDay({
  date,
  isCurrentMonth,
  isSelected,
  isBlocked,
  hasFinanceSchedule,
  hasReservationSchedule,
  showScheduleDots,
  onDateSelect,
  variant = 'page',
}: CalendarDayProps) {
  const baseBg = variant === 'drawer' ? 'bg-mainwhite' : 'bg-background';
  const selectedBg = 'bg-primaryhalf text-mainblack';
  const disabledBg = `${baseBg} opacity-50 cursor-not-allowed`;
  const normalBg = `${baseBg} text-mainblack`;
  return (
    <div className='relative flex justify-center'>
      <Button
        disabled={isBlocked}
        onClick={() => onDateSelect(date)}
        className={cn(
          'flex h-[37px] w-[37px] items-center justify-center rounded-full p-0 text-[18px] font-[400]',
          !isCurrentMonth && 'opacity-50',
          isBlocked ? disabledBg : isSelected ? selectedBg : normalBg
        )}
      >
        {date.getDate()}
      </Button>
      {showScheduleDots && (hasFinanceSchedule || hasReservationSchedule) && (
        <div className='absolute bottom-1 left-1/2 flex -translate-x-1/2 transform gap-0.5'>
          {hasReservationSchedule && (
            <div className='bg-primarycolor h-1 w-1 rounded-full'></div>
          )}
          {hasFinanceSchedule && (
            <div className='bg-red h-1 w-1 rounded-full'></div>
          )}
        </div>
      )}
    </div>
  );
}
