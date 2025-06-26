'use client';

import { TIMES } from '@/constants/calendar';
import { UseCalendarDrawerProps } from '@/types/Calendar';
import { useState, useEffect } from 'react';
import {
  getReservedTimes,
  getFullyBookedDates,
} from '@/lib/actions/ReservationActions';

export function useCalendarDrawer({
  partnerServiceId,
  viewOnly = false,
}: UseCalendarDrawerProps) {
  const times = TIMES;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>();
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>(times);

  // 단일 상태로 년/월 관리
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  // 전체 예약된 날짜들을 가져오는 함수
  const loadBlockedDates = async (year: number, month: number) => {
    try {
      const fullyBooked = await getFullyBookedDates(
        partnerServiceId,
        year,
        month
      );
      setBlockedDates(fullyBooked);
    } catch (error) {
      console.error('Failed to load blocked dates:', error);
    }
  };

  // 선택된 날짜의 예약된 시간들을 가져오는 함수
  const loadReservedTimes = async (date: Date) => {
    try {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`; // 'YYYY-MM-DD'

      const reserved = await getReservedTimes(partnerServiceId, dateStr);
      setReservedTimes(reserved);

      if (!viewOnly) {
        // 예약 가능한 시간들 계산
        const available = times.filter((time) => !reserved.includes(time));
        setAvailableTimes(available);

        // 선택된 시간이 예약된 시간이면 초기화
        if (selectedTime && reserved.includes(selectedTime)) {
          setSelectedTime(undefined);
        }
      }
    } catch (error) {
      console.error('Failed to load reserved times:', error);
    }
  };

  // 달력 월 변경 핸들러
  const handleMonthChange = (year: number, month: number) => {
    setCurrentCalendarMonth({ year, month });
  };

  // 달력이 변경될 때마다 블록된 날짜 로드 (예약 모드에서만)
  useEffect(() => {
    if (!viewOnly) {
      loadBlockedDates(currentCalendarMonth.year, currentCalendarMonth.month);
    }
  }, [partnerServiceId, viewOnly, currentCalendarMonth]);

  // 선택된 날짜가 변경될 때 예약된 시간 로드
  useEffect(() => {
    if (selectedDate) {
      loadReservedTimes(selectedDate);
    }
  }, [selectedDate, partnerServiceId]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (!viewOnly) {
      setSelectedTime(undefined);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (!viewOnly && availableTimes.includes(time)) {
      setSelectedTime(time);
    }
  };

  return {
    times,
    selectedDate,
    selectedTime,
    blockedDates,
    reservedTimes,
    availableTimes,
    // 날짜/월 상태와 변경 함수를 반환
    calendarYear: currentCalendarMonth.year,
    calendarMonth: currentCalendarMonth.month,
    setCalendarYear: (year: number) =>
      handleMonthChange(year, currentCalendarMonth.month),
    setCalendarMonth: (month: number) =>
      handleMonthChange(currentCalendarMonth.year, month),
    handleDateSelect,
    handleTimeSelect,
  };
}
