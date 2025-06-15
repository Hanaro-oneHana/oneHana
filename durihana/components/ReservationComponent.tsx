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
import { formatDate, formatDisplayDate } from '@/lib/utils';
import AlertModal from './alert/AlertModal';
import Button from './atoms/Button';
import CalendarComponent from './atoms/CalendarComponent';
import HorizontalSlider from './atoms/HorizontalSlider';
import Txt from './atoms/Txt';

type Props = {
  partnerServiceId: number;
};

export default function ReservationComponent({ partnerServiceId }: Props) {
  const times = TIMES;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>();
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>(times);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 전체 예약된 날짜들을 가져오는 함수
  const loadBlockedDates = async (year: number, month: number) => {
    try {
      const fullyBooked = await getFullyBookedDates(
        partnerServiceId,
        year,
        month
      );
      console.log('🚀 ~ loadBlockedDates ~ fullyBooked:', fullyBooked);
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

      // 예약 가능한 시간들 계산
      const available = times.filter((time) => !reserved.includes(time));
      setAvailableTimes(available);

      // 선택된 시간이 예약된 시간이면 초기화
      if (selectedTime && reserved.includes(selectedTime)) {
        setSelectedTime(undefined);
      }
    } catch (error) {
      console.error('Failed to load reserved times:', error);
    }
  };

  // 컴포넌트 마운트 시 현재 월의 블록된 날짜들 로드
  useEffect(() => {
    const now = new Date();
    loadBlockedDates(now.getFullYear(), now.getMonth());
  }, [partnerServiceId]);

  // 선택된 날짜가 변경될 때 해당 날짜의 예약된 시간들 로드
  useEffect(() => {
    if (selectedDate) {
      loadReservedTimes(selectedDate);
    }
  }, [selectedDate, partnerServiceId]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // 날짜 변경 시 선택된 시간 초기화
  };

  const handleReservationConfirm = () => {
    if (selectedDate && selectedTime) {
      console.log('예약 정보:', {
        partnerServiceId,
        date: selectedDate,
        time: selectedTime,
      });
      // 실제 예약 처리 로직 추가
      setShowSuccessModal(true);
    }
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button>예약하기</Button>
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
                />
              </div>
            </div>

            <div className='space-y-3'>
              <Txt weight='font-[400]' size='text-[15px]' className=' ml-[8px]'>
                상담 가능 시간
              </Txt>
              <HorizontalSlider className='px-0'>
                <div className='flex'>
                  {times.map((time) => {
                    const isReserved = reservedTimes.includes(time);
                    const isAvailable = availableTimes.includes(time);

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
                  })}
                </div>
              </HorizontalSlider>
            </div>
          </div>

          <DrawerFooter className='px-4 pt-4 ml-[8px]'>
            <DrawerClose asChild>
              <Button
                className='w-full bg-primarycolor text-mainwhite'
                disabled={!selectedDate || !selectedTime}
                onClick={handleReservationConfirm}
              >
                확인
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {showSuccessModal && (
        <AlertModal onClose={() => setShowSuccessModal(false)}>
          <div className='flex flex-col items-center text-center space-y-4'>
            <Txt
              size='text-[18px]'
              weight='font-[600]'
              className='text-mainblack'
            >
              예약 완료
            </Txt>
            <div className='space-y-2'>
              <Txt size='text-[16px]' className='text-mainblack'>
                {selectedDate && formatDisplayDate(selectedDate)}
              </Txt>
              <Txt size='text-[16px]' className='text-mainblack'>
                {` ${selectedTime}`}
              </Txt>
              <br />
              <Txt size='text-[14px]' className='text-mainblack mt-2'>
                예약이 완료되었습니다.
              </Txt>
            </div>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className='w-full bg-primarycolor text-mainwhite mt-4'
            >
              확인
            </Button>
          </div>
        </AlertModal>
      )}
    </>
  );
}
