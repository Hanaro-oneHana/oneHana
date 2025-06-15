'use client';

import { cn } from '@/lib/utils';
import Button from '../atoms/Button';

type CalendarDayProps = {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isBlocked: boolean;
  hasSchedule: boolean;
  showScheduleDots: boolean;
  onDateSelect: (date: Date) => void;
};

export default function CalendarDay({
  date,
  isCurrentMonth,
  isSelected,
  isBlocked,
  hasSchedule,
  showScheduleDots,
  onDateSelect,
}: CalendarDayProps) {
  return (
    <div className='relative'>
      <Button
        disabled={isBlocked}
        onClick={() => onDateSelect(date)}
        className={cn(
          'h-10 w-full flex items-center justify-center rounded-full text-sm p-0 relative',
          !isCurrentMonth && 'opacity-50',
          isBlocked
            ? 'bg-mainwhite text-mainblack opacity-50 cursor-not-allowed'
            : isSelected
              ? 'bg-primaryhalf text-mainblack'
              : 'bg-mainwhite text-mainblack'
        )}
      >
        {date.getDate()}
      </Button>
      {/* 일정 점 표시 */}
      {showScheduleDots && hasSchedule && (
        <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2'>
          <div className='w-1 h-1 bg-primarycolor rounded-full'></div>
        </div>
      )}
    </div>
  );
}
