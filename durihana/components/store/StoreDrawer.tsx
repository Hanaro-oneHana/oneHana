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
import { getCheckingAccountByUserId } from '@/lib/actions/AccountActions';
import { StoreDetailProps } from '@/lib/actions/StoreDetailActions';
import { Button, Txt } from '../atoms';
import { minusBalance } from '@/lib/actions/calBalance';

type StoreDrawerProps = {
  details: StoreDetailProps;
  selectedOptions: Record<string, string>;
  onselectedOptions: () => void;
  userId: number;
};

export default function StoreDrawer(drawer: StoreDrawerProps) {
  const { selectedOptions, onselectedOptions } = drawer;
  const img = drawer.details.images;
  const [open, setOpen] = useState(false);

  const price = parseInt(
    drawer.details.info['가격'].replace(/[^0-9]/g, ''),
    10
  );

  const handlePayment = async () => {
    try {
      console.log('결제 시작')
      const accountId = await getCheckingAccountByUserId(drawer.userId);
      console.log('현재 아이디 : ', accountId)
      
      const description = drawer.details.name;

      const result = await minusBalance(accountId, price, description);
      console.log('minusBalance 결과 : ', result)
    } catch (e) {
      console.error('결제 실패', e);
      alert('결제 중 오류가 발생했습니다.');
    }

    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (
      nextOpen &&
      Object.keys(selectedOptions).length !==
        Object.keys(drawer.details.options).length
    ) {
      onselectedOptions();
      return;
    }
    setOpen(nextOpen);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={handleOpenChange}>
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
              <Button onClick={handlePayment}>결제하기</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
