'use client';

import { useUserCalendar } from '@/hooks/useUserCalendar';
import { ScheduleProps } from '@/types/Schedule';
import CalendarComponent from '../atoms/CalendarComponent';
import ScheduleList from './ScheduleList';

export default function UserCalendar({ userId }: ScheduleProps) {
  const {
    selectedDate,
    setSelectedDate,
    // scheduleDates,
    calendarMonth,
    setCalendarMonth,
    calendarYear,
    setCalendarYear,
    loading,
    reservationSchedules,
    financeSchedules,
    financeScheduleDates,
    reservationScheduleDates,
  } = useUserCalendar(userId);

  return (
    <div className='w-full max-w-md mx-auto bg-mainwhite flex flex-col h-screen'>
      {/* 달력 - 고정 영역 */}
      <div className='flex-shrink-0 p-4'>
        <CalendarComponent
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          currentMonth={calendarMonth}
          currentYear={calendarYear}
          onMonthChange={setCalendarMonth}
          onYearChange={setCalendarYear}
          financeScheduleDates={financeScheduleDates}
          reservationScheduleDates={reservationScheduleDates}
          showScheduleDots={true}
        />
      </div>

      {/* 일정 리스트 - 스크롤 영역 */}
      <div className='flex-1 overflow-y-auto px-4 pb-4'>
        <ScheduleList
          loading={loading}
          selectedDate={selectedDate}
          reservationSchedules={reservationSchedules}
          financeSchedules={financeSchedules}
        />
      </div>
    </div>
  );
}
