'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { monthNames } from '@/constants/calendar';
import { CalendarHeaderProps } from '@/types/Calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Txt } from '../atoms';

export default function CalendarHeader({
  currentMonth,
  currentYear,
  onPreviousMonth,
  onNextMonth,
  onMonthSelect,
  onYearSelect,
  variant = 'page',
}: CalendarHeaderProps) {
  // 버튼 배경 설정
  const bgClass = variant === 'drawer' ? 'bg-mainwhite' : 'bg-background';

  const yearOptions = Array.from(
    { length: 21 },
    (_, i) => currentYear - 10 + i
  );

  return (
    <div
      className={cn(
        'mb-4 flex items-center justify-between px-2',
        variant === 'drawer' ? 'bg-mainwhite' : 'bg-background'
      )}
    >
      <Button
        onClick={onPreviousMonth}
        className={cn('text-mainblack h-auto w-auto rounded-full p-2', bgClass)}
      >
        <ChevronLeft size={24} />
      </Button>
      <div className='flex items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-1 rounded-lg px-2 py-1'>
            <Txt size='text-[20px]' weight='font-[400]'>
              {monthNames[currentMonth]}
            </Txt>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex max-h-60 flex-col overflow-y-auto'>
            {monthNames.map((m, i) => (
              <DropdownMenuItem key={m} onClick={() => onMonthSelect(i)}>
                {m}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-1 rounded-lg px-2 py-1'>
            <Txt size='text-[20px]' weight='font-[400]'>
              {currentYear}년
            </Txt>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex max-h-60 flex-col overflow-y-auto'>
            {yearOptions.map((y) => (
              <DropdownMenuItem key={y} onClick={() => onYearSelect(y)}>
                {y}년
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        onClick={onNextMonth}
        className={cn('text-mainblack h-auto w-auto rounded-full p-2', bgClass)}
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );
}
