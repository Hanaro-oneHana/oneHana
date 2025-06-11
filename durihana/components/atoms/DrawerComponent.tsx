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
import Button from './Button';
import CalendarComponent from './CalendarComponent';

export default function DrawerComponent() {
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

        <div className='mx-auto w-full max-w-sm'>
          <div className='p-4 flex justify-center'>
            <CalendarComponent />
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button>취소</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
