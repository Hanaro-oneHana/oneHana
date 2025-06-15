'use client';

import { Schedule } from '@/types/Schedule';
import { useState, useEffect } from 'react';
import {
  getUserSchedulesForDate,
  getScheduleDates,
} from '@/lib/actions/UserCalendarActions';
import { formatDate } from '@/lib/utils';

export function useUserCalendar(userId: number) {
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
      const dateStr = formatDate(date);
      console.log('🚀 ~ loadSchedulesForDate ~ dateStr:', dateStr);

      const { personalSchedules, reservations } = await getUserSchedulesForDate(
        userId,
        dateStr
      );

      const formattedSchedules: Schedule[] = [];

      // 금융 일정 변환 (기존 개인 일정)
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
          type: 'finance',
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
  const financeSchedules = schedules.filter((s) => s.type === 'finance');

  return {
    selectedDate,
    setSelectedDate,
    schedules,
    scheduleDates,
    calendarMonth,
    setCalendarMonth,
    calendarYear,
    setCalendarYear,
    loading,
    reservationSchedules,
    financeSchedules,
  };
}
