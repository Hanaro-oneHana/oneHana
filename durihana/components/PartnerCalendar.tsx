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

type Props = {
  partnerServiceId: number;
};

export default function PartnerCalendar({ partnerServiceId }: Props) {
  const times = TIMES;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
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
    } catch (error) {
      console.error('Failed to load reserved times:', error);
    }
  };

  // 컴포넌트 마운트 시 현재 월의 블록된 날짜들 로드
  useEffect(() => {
    loadBlockedDates(calendarYear, calendarMonth);
  }, [partnerServiceId, calendarMonth, calendarYear]);

  // 선택된 날짜가 변경될 때 해당 날짜의 예약된 시간들 로드
  useEffect(() => {
    if (selectedDate) {
      loadReservedTimes(selectedDate);
    }
  }, [selectedDate, partnerServiceId]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>상담 일정 보기</Button>
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
                onDateSelect={setSelectedDate}
                blockedDates={blockedDates}
                currentMonth={calendarMonth}
                currentYear={calendarYear}
                onMonthChange={setCalendarMonth}
                onYearChange={setCalendarYear}
              />
            </div>
          </div>

          <div className='space-y-3'>
            <Txt weight='font-[500]' className=' ml-[8px]'>
              상담 가능 시간
            </Txt>
            <HorizontalSlider className='px-0'>
              <div className='flex'>
                {times.map((time) => {
                  const isReserved = reservedTimes.includes(time);

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
                })}
              </div>
            </HorizontalSlider>
          </div>
        </div>

        <DrawerFooter className='px-4 pt-4 ml-[8px]'>
          <DrawerClose asChild>
            <Button className='w-full bg-primarycolor text-mainwhite'>
              닫기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
