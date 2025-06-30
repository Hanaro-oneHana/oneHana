'use client';

import { useCalendar } from '@/hooks/useCalendar';
import { CustomCalendarProps } from '@/types/Calendar';
import { cn } from '@/lib/utils';
import CalendarGrid from '../calendar/CalendarGrid';
import CalendarHeader from '../calendar/CalendarHeader';

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
    <div className={cn('mx-auto w-full max-w-sm', bgClass, className)}>
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
