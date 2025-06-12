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

export default function ReservationComponent() {
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
  const [selectedTime, setSelectedTime] = useState<string>();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>예약하기</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle />
          <DrawerDescription />
        </DrawerHeader>

        <CalendarComponent />
        <span className='px-[20px]'>상담 가능 시간</span>
        <HorizontalSlider className='flex px-[20px] space-x-[9px]'>
          {times.map((t) => (
            <Button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`text-mainblack p-[8px] ${selectedTime === t ? 'bg-iconselect' : 'bg-white'}`}
            >
              {t}
            </Button>
          ))}
        </HorizontalSlider>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              className='w-full px-[30px] py-[15px] bg-primarycolor text-mainwhite'
              // disabled={!selectedTime}
            >
              확인
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
