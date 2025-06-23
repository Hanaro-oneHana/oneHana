'use client';

import { useCalendar } from '@/hooks/useCalendar';
import { cn } from '@/lib/utils';
import CalendarGrid from '../calendar/CalendarGrid';
import CalendarHeader from '../calendar/CalendarHeader';

type CustomCalendarProps = {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
  blockedDates?: Date[];
  currentMonth?: number;
  currentYear?: number;
  onMonthChange?: (month: number) => void;
  onYearChange?: (year: number) => void;
  financeScheduleDates?: Date[];
  reservationScheduleDates?: Date[];
  showScheduleDots?: boolean;
  variant?: 'page' | 'drawer';
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
  financeScheduleDates = [],
  reservationScheduleDates = [],
  showScheduleDots = false,
  variant = 'page',
}: CustomCalendarProps) {
  const {
    currentMonth,
    currentYear,
    calendarDays,
    internalSelectedDate,
    goToPreviousMonth,
    goToNextMonth,
    handleDateSelect,
    handleMonthSelect,
    handleYearSelect,
    isSameDay,
  } = useCalendar({
    selectedDate,
    currentMonth: propCurrentMonth,
    currentYear: propCurrentYear,
    onMonthChange,
    onYearChange,
    onDateSelect,
  });
  const bgClass = variant === 'drawer' ? 'bg-mainwhite' : 'bg-background';

  return (
    <div className={cn('w-full max-w-sm mx-auto', bgClass, className)}>
      <CalendarHeader
        variant={variant}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onMonthSelect={handleMonthSelect}
        onYearSelect={handleYearSelect}
      />
      <CalendarGrid
        variant={variant}
        calendarDays={calendarDays}
        selectedDate={internalSelectedDate}
        blockedDates={blockedDates}
        financeScheduleDates={financeScheduleDates}
        reservationScheduleDates={reservationScheduleDates}
        showScheduleDots={showScheduleDots}
        onDateSelect={handleDateSelect}
        isSameDay={isSameDay}
      />
    </div>
  );
}
