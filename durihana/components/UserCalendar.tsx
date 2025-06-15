'use client';

import { useState, useEffect } from 'react';
import {
  getUserSchedulesForDate,
  getScheduleDates,
} from '@/lib/actions/UserCalendarActions';
import { formatDisplayDate, formatDate } from '@/lib/utils';
import CalendarComponent from './atoms/CalendarComponent';
import Txt from './atoms/Txt';

type Schedule = {
  id: number;
  title: string;
  date: Date;
  time: string;
  type: 'reservation' | 'personal';
  partnerName?: string;
};

type Props = {
  userId: number;
};

export default function UserCalendar({ userId }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleDates, setScheduleDates] = useState<Date[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  // 일정이 있는 날짜들 로드 (달력 점 표시용)
  const loadScheduleDates = async (year: number, month: number) => {
    try {
      const dates = await getScheduleDates(userId, year, month);
      setScheduleDates(dates);
    } catch (error) {
      console.error('Failed to load schedule dates:', error);
    }
  };

  // 선택된 날짜의 일정들 로드
  const loadSchedulesForDate = async (date: Date) => {
    try {
      setLoading(true);
      const dateStr = formatDate(date); // formatDate 함수 사용 (기존에 있던 함수)
      console.log('🚀 ~ loadSchedulesForDate ~ dateStr:', dateStr);

      const { personalSchedules, reservations } = await getUserSchedulesForDate(
        userId,
        dateStr
      );

      const formattedSchedules: Schedule[] = [];

      // 개인 일정 변환
      personalSchedules.forEach((schedule) => {
        console.log('🚀 ~ personalSchedule:', schedule);
        const timePart = schedule.user_date.includes(' ')
          ? schedule.user_date.split(' ')[1]
          : '00:00';
        const datePart = schedule.user_date.includes(' ')
          ? schedule.user_date.split(' ')[0]
          : schedule.user_date;

        // 시간대 문제 해결을 위해 로컬 시간대로 Date 생성
        const [year, month, day] = datePart.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);

        formattedSchedules.push({
          id: schedule.id,
          title: schedule.partnerservice.name,
          date: localDate,
          time: timePart,
          type: 'personal',
          partnerName: schedule.partnerservice.partner.name,
        });
      });

      // 예약 일정 변환
      reservations.forEach((reservation) => {
        console.log('🚀 ~ reservation:', reservation);
        const timePart = reservation.reservation_date.includes(' ')
          ? reservation.reservation_date.split(' ')[1]
          : '00:00';
        const datePart = reservation.reservation_date.includes(' ')
          ? reservation.reservation_date.split(' ')[0]
          : reservation.reservation_date;

        // 시간대 문제 해결을 위해 로컬 시간대로 Date 생성
        const [year, month, day] = datePart.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);

        formattedSchedules.push({
          id: reservation.id,
          title: reservation.partnerservice.name,
          date: localDate,
          time: timePart,
          type: 'reservation',
          partnerName: reservation.partnerservice.partner.name,
        });
      });

      console.log('🚀 ~ formattedSchedules:', formattedSchedules);

      // 시간순 정렬
      formattedSchedules.sort((a, b) => a.time.localeCompare(b.time));
      setSchedules(formattedSchedules);
    } catch (error) {
      console.error('Failed to load schedules for date:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 및 월 변경 시 일정 날짜들 로드
  useEffect(() => {
    loadScheduleDates(calendarYear, calendarMonth);
  }, [userId, calendarMonth, calendarYear]);

  // 선택된 날짜 변경 시 해당 날짜의 일정들 로드
  useEffect(() => {
    loadSchedulesForDate(selectedDate);
  }, [selectedDate, userId]);

  const reservationSchedules = schedules.filter(
    (s) => s.type === 'reservation'
  );
  const personalSchedules = schedules.filter((s) => s.type === 'personal');

  return (
    <div className='w-full max-w-md mx-auto bg-mainwhite p-4 space-y-6'>
      {/* 달력 */}
      <div className='w-full'>
        <CalendarComponent
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          currentMonth={calendarMonth}
          currentYear={calendarYear}
          onMonthChange={setCalendarMonth}
          onYearChange={setCalendarYear}
          scheduleDates={scheduleDates}
          showScheduleDots={true}
        />
      </div>

      {loading && (
        <div className='text-center py-4'>
          <Txt size='text-[14px]' className='text-gray-500'>
            일정을 불러오는 중...
          </Txt>
        </div>
      )}

      {!loading && (
        <>
          {/* 예약내역 */}
          {reservationSchedules.length > 0 && (
            <div className='space-y-3'>
              <Txt
                size='text-[16px]'
                weight='font-[600]'
                className='text-mainblack'
              >
                예약내역
              </Txt>
              <div className='space-y-2'>
                {reservationSchedules.map((schedule) => (
                  <div
                    key={`reservation-${schedule.id}`}
                    className='bg-gray-50 p-3 rounded-lg'
                  >
                    <Txt
                      size='text-[14px]'
                      weight='font-[500]'
                      className='text-mainblack'
                    >
                      {schedule.title}
                    </Txt>
                    <div className='flex items-center gap-2 mt-1'>
                      <Txt size='text-[12px]' className='text-gray-600'>
                        📅 {formatDisplayDate(schedule.date)}
                      </Txt>
                      <Txt size='text-[12px]' className='text-gray-600'>
                        🕐 {schedule.time}
                      </Txt>
                    </div>
                    <Txt size='text-[12px]' className='text-gray-500 mt-1'>
                      📍 {schedule.partnerName}
                    </Txt>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 개인 일정 */}
          {personalSchedules.length > 0 && (
            <div className='space-y-3'>
              <Txt
                size='text-[16px]'
                weight='font-[600]'
                className='text-mainblack'
              >
                개인 일정
              </Txt>
              <div className='space-y-2'>
                {personalSchedules.map((schedule) => (
                  <div
                    key={`personal-${schedule.id}`}
                    className='bg-gray-50 p-3 rounded-lg'
                  >
                    <Txt
                      size='text-[14px]'
                      weight='font-[500]'
                      className='text-mainblack'
                    >
                      {schedule.title}
                    </Txt>
                    <div className='flex items-center gap-2 mt-1'>
                      <Txt size='text-[12px]' className='text-gray-600'>
                        📅 {formatDisplayDate(schedule.date)}
                      </Txt>
                      <Txt size='text-[12px]' className='text-gray-600'>
                        🕐 {schedule.time}
                      </Txt>
                    </div>
                    <Txt size='text-[12px]' className='text-gray-500 mt-1'>
                      📍 {schedule.partnerName}
                    </Txt>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 선택된 날짜에 일정이 없을 때 */}
          {schedules.length === 0 && (
            <div className='text-center py-8'>
              <Txt size='text-[14px]' className='text-gray-500'>
                {formatDisplayDate(selectedDate)}에 일정이 없습니다.
              </Txt>
            </div>
          )}
        </>
      )}
    </div>
  );
}
