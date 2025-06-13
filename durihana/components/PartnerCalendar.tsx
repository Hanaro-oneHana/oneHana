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
import { useState } from 'react';
import Button from './atoms/Button';
import CalendarComponent from './atoms/CalendarComponent';
import HorizontalSlider from './atoms/HorizontalSlider';
import Txt from './atoms/Txt';

export default function PartnerCalendar() {
  const times = [
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>();

  return (
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
                onDateSelect={setSelectedDate}
              />
            </div>
          </div>

          <div className='space-y-3'>
            <Txt weight='font-[500]' className=' ml-[8px]'>
              상담 가능 시간
            </Txt>
            <HorizontalSlider className='px-0'>
              <div className='flex'>
                {times.map((time) => (
                  <Button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                      transition-colors duration-200
                      ${
                        selectedTime === time
                          ? 'bg-iconselect text-mainblack'
                          : 'bg-linegray text-mainblack'
                      }
                    `}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </HorizontalSlider>
          </div>
        </div>

        <DrawerFooter className='px-4 pt-4 ml-[8px]'>
          <DrawerClose asChild>
            <Button
              className='w-full bg-primarycolor text-mainwhite'
              onClick={() => {
                if (selectedDate && selectedTime) {
                  // console.log('예약 정보:', {
                  //   date: selectedDate,
                  //   time: selectedTime,
                  // });
                  // 데이터 처리
                }
              }}
            >
              확인
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
