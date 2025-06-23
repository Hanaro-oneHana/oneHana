'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';
import { useState } from 'react';
import { StoreDetailProps } from '@/lib/actions/StoreDetailActions';
import { Button, Txt } from '../atoms';

type StoreDrawerProps = {
  details: StoreDetailProps;
  selectedOptions: Record<string, string>;
};

export default function StoreDrawer(drawer: StoreDrawerProps) {
  const img = drawer.details.images;
  const selectedOptions = drawer.selectedOptions;
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className='bg-buttongray h-[48px] w-full'>결제하기</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {img && (
              <div className='w-full flex gap-[20px] relative mb-[20px]'>
                <img
                  src={img[0]}
                  alt='Store image'
                  width={60}
                  height={60}
                  className='object-cover rounded-lg'
                />
                <Txt className='text-[15px] mt-[25px]'>
                  {drawer.details.name}
                </Txt>
              </div>
            )}
          </DrawerTitle>
          <hr className='w-full' />
        </DrawerHeader>

        {/* 여기서 selectedOptions 보여주기 */}

        <div className='px-[20px]'>
          <Txt className='text-[13px]'>
            <DrawerDescription className='pb-[10px]'>
              선택한 옵션
            </DrawerDescription>
            <ul className='list-none list-inside '>
              {Object.entries(selectedOptions).map(([key, val]) => (
                <li key={key} className='pb-[5px]'>
                  {key}: {val}
                </li>
              ))}
            </ul>
          </Txt>
        </div>
        <div className='flex justify-end pr-[20px]'>
          <Txt color='text-primarycolor' weight='font-[600]'>
            {drawer.details.info['가격']}
          </Txt>
        </div>
        <DrawerFooter className='flex justify-end gap-2'>
          <DrawerClose asChild>
            <Button>결제하기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
