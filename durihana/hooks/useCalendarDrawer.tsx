'use client';

import { useState, useEffect } from 'react';
import {
  getReservedTimes,
  getFullyBookedDates,
} from '@/lib/actions/ReservationActions';
import { TIMES } from '@/lib/times';
import { formatDate } from '@/lib/utils';

type UseCalendarDrawerProps = {
  partnerServiceId: number;
  viewOnly?: boolean;
};

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
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // 전체 예약된 날짜들을 가져오는 함수
  const loadBlockedDates = async (year: number, month: number) => {
    try {
      const fullyBooked = await getFullyBookedDates(
        partnerServiceId,
        year,
        month
      );
      if (!viewOnly) {
        console.log('🚀 ~ loadBlockedDates ~ fullyBooked:', fullyBooked);
      }
      setBlockedDates(fullyBooked);
    } catch (error) {
      console.error('Failed to load blocked dates:', error);
    }
  };

  // 선택된 날짜의 예약된 시간들을 가져오는 함수
  const loadReservedTimes = async (date: Date) => {
    try {
      const dateStr = formatDate(date); // '2025-01-15'
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

  // 컴포넌트 마운트 시 현재 월의 블록된 날짜들 로드
  useEffect(() => {
    loadBlockedDates(calendarYear, calendarMonth);
  }, [partnerServiceId, calendarMonth, calendarYear]);

  // 달력 월이 변경될 때마다 해당 월의 블록된 날짜들 로드 (예약 모드에서만)
  useEffect(() => {
    if (!viewOnly) {
      loadBlockedDates(currentCalendarMonth.year, currentCalendarMonth.month);
    }
  }, [currentCalendarMonth, partnerServiceId, viewOnly]);

  // 선택된 날짜가 변경될 때 해당 날짜의 예약된 시간들 로드
  useEffect(() => {
    if (selectedDate) {
      loadReservedTimes(selectedDate);
    }
  }, [selectedDate, partnerServiceId]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (!viewOnly) {
      setSelectedTime(undefined); // 날짜 변경 시 선택된 시간 초기화
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
    calendarMonth,
    calendarYear,
    setCalendarMonth,
    setCalendarYear,
    handleDateSelect,
    handleTimeSelect,
  };
}
