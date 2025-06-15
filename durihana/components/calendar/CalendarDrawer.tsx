'use client';

import {
  Drawer,
  DrawerTrigger,
  DrawerContent as UIDrawerContent,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { useCalendarDrawer } from '@/hooks/useCalendarDrawer';
import Button from '../atoms/Button';
import CalendarDrawerContent from './DrawerContent';

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
  const {
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
  } = useCalendarDrawer({ partnerServiceId, viewOnly });

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

      <UIDrawerContent className='max-w-md mx-auto bg-mainwhite'>
        <DrawerHeader className='relative pb-2'>
          <DrawerTitle className='text-center'></DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <CalendarDrawerContent
          selectedDate={selectedDate}
          blockedDates={blockedDates}
          calendarMonth={calendarMonth}
          calendarYear={calendarYear}
          times={times}
          reservedTimes={reservedTimes}
          availableTimes={availableTimes}
          selectedTime={selectedTime}
          viewOnly={viewOnly}
          onDateSelect={handleDateSelect}
          onMonthChange={setCalendarMonth}
          onYearChange={setCalendarYear}
          onTimeSelect={handleTimeSelect}
        />

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
      </UIDrawerContent>
    </Drawer>
  );
}
