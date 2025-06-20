'use client';

import { useUserCalendar } from '@/hooks/useUserCalendar';
import { ScheduleProps } from '@/types/Schedule';
import CalendarComponent from '../atoms/CalendarComponent';
import ScheduleList from './ScheduleList';

export default function UserCalendar({ userId }: ScheduleProps) {
  const {
    selectedDate,
    setSelectedDate,
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

  // // 계좌 생성 후 달력 새로고침을 위한 함수
  // const handleAccountCreated = () => {
  //   // 현재 월의 일정 다시 로드하기 위해 상태를 강제로 업데이트
  //   setCalendarMonth(calendarMonth);
  // };

  return (
    <div className='w-full max-w-md mx-auto bg-background h-screen flex flex-col'>
      {/* 달력 - 고정 영역 */}
      <div className='flex-shrink-0 p-4 mt-14'>
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
