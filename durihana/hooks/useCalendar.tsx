'use client';

import { UseCalendarProps } from '@/types/Calendar';
import { useState, useEffect } from 'react';

export function useCalendar({
  selectedDate,
  currentMonth: propCurrentMonth,
  currentYear: propCurrentYear,
  onMonthChange,
  onYearChange,
  onDateSelect,
}: UseCalendarProps) {
  const currentDate = selectedDate || new Date();
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

  // 달력 날짜 생성
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

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return {
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
  };
}
