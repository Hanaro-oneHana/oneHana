'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Txt } from '../atoms';

type CalendarHeaderProps = {
  currentMonth: number;
  currentYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthSelect: (month: number) => void;
  onYearSelect: (year: number) => void;
  /**
   * 'page' (UserCalendar) or 'drawer' (CalendarDrawer) 배경 버전
   */
  variant?: 'page' | 'drawer';
};

const monthNames = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

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
        'flex justify-between items-center mb-4 px-2',
        variant === 'drawer' ? 'bg-mainwhite' : 'bg-background'
      )}
    >
      <Button
        onClick={onPreviousMonth}
        className={cn('p-2 w-auto h-auto rounded-full text-mainblack', bgClass)}
      >
        <ChevronLeft size={24} />
      </Button>
      <div className='flex items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-1 px-2 py-1 rounded-lg'>
            <Txt size='text-[20px]' weight='font-[400]'>
              {monthNames[currentMonth]}
            </Txt>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex flex-col max-h-60 overflow-y-auto'>
            {monthNames.map((m, i) => (
              <DropdownMenuItem key={m} onClick={() => onMonthSelect(i)}>
                {m}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-1 px-2 py-1 rounded-lg'>
            <Txt size='text-[20px]' weight='font-[400]'>
              {currentYear}년
            </Txt>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex flex-col max-h-60 overflow-y-auto'>
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
        className={cn('p-2 w-auto h-auto rounded-full text-mainblack', bgClass)}
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );
}
