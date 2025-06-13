'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import Txt from './Txt';

type CustomCalendarProps = {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
};

export default function CalendarComponent({
  selectedDate,
  onDateSelect,
  className,
}: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [calendarDays, setCalendarDays] = useState<
    Array<{ date: Date; isCurrentMonth: boolean }>
  >([]);
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(
    selectedDate || new Date()
  );

  // 요일 라벨
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 월 이름
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

  // 달력 데이터 생성
  useEffect(() => {
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // 현재 월의 첫 날
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

    // 현재 월의 마지막 날
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // 이전 월의 마지막 날
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0);

    // 첫 주의 시작일 (이전 달의 날짜 포함)
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // 이전 달의 날짜 추가
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(
        currentYear,
        currentMonth - 1,
        lastDayOfPrevMonth.getDate() - i
      );
      days.push({ date: day, isCurrentMonth: false });
    }

    // 현재 달의 날짜 추가
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const day = new Date(currentYear, currentMonth, i);
      days.push({ date: day, isCurrentMonth: true });
    }

    // 다음 달의 날짜 추가 (6주 채우기)
    const remainingDays = 42 - days.length; // 6주 x 7일 = 42
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(currentYear, currentMonth + 1, i);
      days.push({ date: day, isCurrentMonth: false });
    }

    setCalendarDays(days);
  }, [currentMonth, currentYear]);

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (day: Date) => {
    setInternalSelectedDate(day);
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  // 년도 선택 범위 생성 (현재 년도 ±10년)
  const yearOptions = Array.from(
    { length: 21 },
    (_, i) => currentYear - 10 + i
  );

  // 날짜 비교 함수 (년, 월, 일이 같은지)
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 오늘 날짜인지 확인
  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  return (
    <div className={cn('w-full max-w-sm mx-auto', className)}>
      {/* 헤더 - 년월 선택 */}
      <div className='flex justify-between items-center mb-4 px-2'>
        <Button
          onClick={goToPreviousMonth}
          className='p-2 w-auto h-auto rounded-full bg-mainwhite text-mainblack'
        >
          <ChevronLeft size={20} />
        </Button>

        <div className='flex items-center gap-2'>
          {/* 월 선택 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1 px-2 py-1 rounded-lg'>
              <Txt weight='font-[500]'>{monthNames[currentMonth]}</Txt>
              <ChevronDown size={14} className='text-mainblack' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {monthNames.map((month, index) => (
                <DropdownMenuItem
                  key={month}
                  onClick={() => setCurrentMonth(index)}
                  className={cn('cursor-pointer')}
                >
                  {month}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 년도 선택 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1 px-2 py-1  rounded-lg'>
              <Txt weight='font-[500]'>{currentYear}년</Txt>
              <ChevronDown size={14} className='text-mainblack' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='max-h-60 overflow-y-auto'>
              {yearOptions.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => setCurrentYear(year)}
                  className={cn('cursor-pointer')}
                >
                  {year}년
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          onClick={goToNextMonth}
          className='p-2 w-auto h-auto rounded-full text-mainblack size-sm bg-mainwhite'
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      <div className='grid grid-cols-7 mb-2'>
        {weekDays.map((day) => (
          <div key={day} className={cn('text-center text-sm py-2')}>
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className='grid grid-cols-7 gap-1'>
        {calendarDays.map((dayObj, index) => {
          const { date, isCurrentMonth } = dayObj;
          const isSelected =
            internalSelectedDate && isSameDay(date, internalSelectedDate);

          return (
            <Button
              key={index}
              onClick={() => handleDateSelect(date)}
              className={cn(
                'h-10 w-full flex items-center justify-center rounded-full text-sm p-0 size-sm bg-mainwhite text-mainblack',
                !isCurrentMonth && 'opacity-50',
                isSelected
                  ? 'bg-iconselect text-mainblack'
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
