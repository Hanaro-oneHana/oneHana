'use client';

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { useState, useEffect } from 'react';
import {
  getReservedTimes,
  getFullyBookedDates,
} from '@/lib/actions/ReservationActions';
import { TIMES } from '@/lib/times';
import { formatDate } from '@/lib/utils';
import Button from './atoms/Button';
import CalendarComponent from './atoms/CalendarComponent';
import HorizontalSlider from './atoms/HorizontalSlider';
import Txt from './atoms/Txt';

export interface CalendarDrawerProps {
  partnerServiceId: number;
  triggerLabel: string;
  viewOnly?: boolean; // true면 예약 불필요 (조회 전용)
  onConfirm?: (date: Date, time: string) => void; // 예약 모드일 때 confirm 콜백
}

export function CalendarDrawer({
  partnerServiceId,
  triggerLabel,
  viewOnly = false,
  onConfirm,
}: CalendarDrawerProps) {
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

  const handleReservationConfirm = () => {
    if (!viewOnly && selectedDate && selectedTime && onConfirm) {
      onConfirm(selectedDate, selectedTime);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DrawerTrigger>

      <DrawerContent className='max-w-md mx-auto bg-mainwhite'>
        <DrawerHeader className='relative pb-2'>
          <DrawerTitle className='text-center'></DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <div className='px-4 pb-4 space-y-6'>
          <div className='space-y-4'>
            <div className='w-full max-w-sm mx-auto'>
              <CalendarComponent
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                blockedDates={blockedDates}
                currentMonth={calendarMonth}
                currentYear={calendarYear}
                onMonthChange={setCalendarMonth}
                onYearChange={setCalendarYear}
              />
            </div>
          </div>

          <div className='space-y-3'>
            <Txt
              weight={viewOnly ? 'font-[500]' : 'font-[400]'}
              size={viewOnly ? undefined : 'text-[15px]'}
              className=' ml-[8px]'
            >
              상담 가능 시간
            </Txt>
            <HorizontalSlider className='px-0'>
              <div className='flex'>
                {times.map((time) => {
                  const isReserved = reservedTimes.includes(time);
                  const isAvailable = availableTimes.includes(time);

                  if (viewOnly) {
                    // 조회 모드: Txt로 표시, 예약된 시간은 흐리게
                    return (
                      <Txt
                        key={time}
                        className={`
                          px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                          transition-colors duration-200
                          ${isReserved ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {time}
                      </Txt>
                    );
                  } else {
                    // 예약 모드: Button으로 표시, 클릭 가능
                    return (
                      <Button
                        key={time}
                        onClick={() =>
                          isAvailable ? setSelectedTime(time) : undefined
                        }
                        disabled={isReserved}
                        className={`
                          px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                          transition-colors duration-200
                          ${
                            isReserved
                              ? 'bg-linegray text-mainblack opacity-50 cursor-not-allowed'
                              : selectedTime === time
                                ? 'bg-primaryhalf text-mainblack'
                                : 'bg-linegray text-mainblack'
                          }
                        `}
                      >
                        {time}
                      </Button>
                    );
                  }
                })}
              </div>
            </HorizontalSlider>
          </div>
        </div>

        <DrawerFooter className='px-4 pt-4 ml-[8px]'>
          <DrawerClose asChild>
            {viewOnly ? (
              <Button className='w-full bg-primarycolor text-mainwhite'>
                닫기
              </Button>
            ) : (
              <Button
                className='w-full bg-primarycolor text-mainwhite'
                disabled={!selectedDate || !selectedTime}
                onClick={handleReservationConfirm}
              >
                확인
              </Button>
            )}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
