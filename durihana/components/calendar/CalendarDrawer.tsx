'use client';

import {
  Drawer,
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewOnly?: boolean; // 조회 전용 모드
  onConfirm?: (date: Date, time: string) => void; // 예약 모드일 때 콜백
}

export default function CalendarDrawer({
  partnerServiceId,
  open,
  onOpenChange,
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
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <UIDrawerContent className='bg-mainwhite mx-auto max-w-md'>
        <DrawerHeader className='relative pb-2'>
          <DrawerTitle className='text-center' />
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

        <DrawerFooter className='ml-[8px] px-4 pt-4'>
          <DrawerClose asChild>
            {viewOnly ? (
              <Button className='bg-primarycolor text-mainwhite w-full'>
                닫기
              </Button>
            ) : (
              <Button
                className='bg-primarycolor text-mainwhite w-full'
                disabled={!selectedDate || !selectedTime}
                onClick={handleReservationConfirm}
              >
                예약하기
              </Button>
            )}
          </DrawerClose>
        </DrawerFooter>
      </UIDrawerContent>
    </Drawer>
  );
}
