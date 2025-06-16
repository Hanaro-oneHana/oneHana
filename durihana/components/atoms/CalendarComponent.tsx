'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Txt from './Txt';

type CustomCalendarProps = {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
  blockedDates?: Date[];
  currentMonth?: number;
  currentYear?: number;
  onMonthChange?: (month: number) => void;
  onYearChange?: (year: number) => void;
};

export default function CalendarComponent({
  selectedDate,
  onDateSelect,
  className,
  blockedDates = [],
  currentMonth: propCurrentMonth,
  currentYear: propCurrentYear,
  onMonthChange,
  onYearChange,
}: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [currentMonth, setCurrentMonth] = useState(
    propCurrentMonth ?? currentDate.getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    propCurrentYear ?? currentDate.getFullYear()
  );
  const [calendarDays, setCalendarDays] = useState<
    Array<{ date: Date; isCurrentMonth: boolean }>
  >([]);
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(
    selectedDate || new Date()
  );

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
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

  // prop으로 받은 월/년이 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (propCurrentMonth !== undefined) {
      setCurrentMonth(propCurrentMonth);
    }
  }, [propCurrentMonth]);

  useEffect(() => {
    if (propCurrentYear !== undefined) {
      setCurrentYear(propCurrentYear);
    }
  }, [propCurrentYear]);

  useEffect(() => {
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // 이전 달 날짜
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(
        currentYear,
        currentMonth - 1,
        lastDayOfPrevMonth.getDate() - i
      );
      days.push({ date: day, isCurrentMonth: false });
    }
    // 현재 달 날짜
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true,
      });
    }
    // 다음 달 날짜 (6주)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false,
      });
    }
    setCalendarDays(days);
  }, [currentMonth, currentYear]);

  const goToPreviousMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    onMonthChange?.(newMonth);
    onYearChange?.(newYear);
  };

  const goToNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    onMonthChange?.(newMonth);
    onYearChange?.(newYear);
  };

  const handleDateSelect = (day: Date) => {
    if (blockedDates.some((bd) => isSameDay(bd, day))) return;
    setInternalSelectedDate(day);
    onDateSelect?.(day);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    onMonthChange?.(monthIndex);
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    onYearChange?.(year);
  };

  const yearOptions = Array.from(
    { length: 21 },
    (_, i) => currentYear - 10 + i
  );
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return (
    <div className={cn('w-full max-w-sm mx-auto', className)}>
      {/* 헤더 */}
      <div className='flex justify-between items-center mb-4 px-2'>
        <Button
          onClick={goToPreviousMonth}
          className='p-2 w-auto h-auto rounded-full bg-mainwhite text-mainblack'
        >
          <ChevronLeft size={24} />
        </Button>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1 px-2 py-1 rounded-lg'>
              <Txt size='text-[20px]'>{monthNames[currentMonth]}</Txt>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {monthNames.map((m, i) => (
                <DropdownMenuItem key={m} onClick={() => handleMonthSelect(i)}>
                  {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1 px-2 py-1 rounded-lg'>
              <Txt size='text-[20px]'>{currentYear}년</Txt>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='max-h-60 overflow-y-auto'>
              {yearOptions.map((y) => (
                <DropdownMenuItem key={y} onClick={() => handleYearSelect(y)}>
                  {y}년
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          onClick={goToNextMonth}
          className='p-2 w-auto h-auto rounded-full text-mainblack size-sm bg-mainwhite'
        >
          <ChevronRight size={24} />
        </Button>
      </div>

      {/* 요일 */}
      <div className='grid grid-cols-7 mb-2'>
        {weekDays.map((wd) => (
          <div key={wd} className='text-center text-[12px] weight-[500] py-2'>
            {wd}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className='grid grid-cols-7 gap-1'>
        {calendarDays.map((dayObj, idx) => {
          const { date, isCurrentMonth } = dayObj;
          const isSelected = isSameDay(date, internalSelectedDate);
          const isBlocked = blockedDates.some((bd) => isSameDay(bd, date));

          return (
            <Button
              key={idx}
              disabled={isBlocked}
              onClick={() => handleDateSelect(date)}
              className={cn(
                'h-10 w-full flex items-center justify-center rounded-full text-sm p-0',
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
          );
        })}
      </div>
    </div>
  );
}
