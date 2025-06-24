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
import { addPartnerCalendarEvent } from '@/lib/actions/ReservationActions';
import {
  insertOptions,
  StoreDetailProps,
} from '@/lib/actions/StoreDetailActions';
import { minusBalance } from '@/lib/actions/calBalance';
import { Button, Txt } from '../atoms';
import { modalMent } from './StoreDetail';

type StoreDrawerProps = {
  details: StoreDetailProps;
  selectedOptions: Record<string, string>;
  onselectedOptions: () => void;
  userId: number;
  onSelectModalMent: (select: (typeof modalMent)[number]) => void;
};

export default function StoreDrawer(drawer: StoreDrawerProps) {
  const {
    selectedOptions,
    onselectedOptions,
    details,
    userId,
    onSelectModalMent,
  } = drawer;
  const img = details.images;
  const [open, setOpen] = useState(false);

  const price = parseInt(details.info['가격'].replace(/[^0-9]/g, ''), 10);
  console.log('🚀 ~ StoreDrawer ~ price:', price);

  const handlePayment = async () => {
    try {
      console.log('결제 시작');
      const accountId = await getCheckingAccountByUserId(userId);
      console.log('현재 아이디 : ', accountId);

      const description = details.name;

      const result = await minusBalance(accountId, price, description);
      await addPartnerCalendarEvent(userId, details.id);
      // Storedrawer 는 가전가구, 예물예단이니까 결제 완료 되면 budgetPlan 의 state 가 3으로 변경
      if (result.success) {
        const insertResult = await insertOptions(
          userId,
          details.id,
          selectedOptions,
          3
        );
        if (insertResult) {
          onSelectModalMent(modalMent[2]);
          onselectedOptions();
        }
      }
      console.log('minusBalance 결과 : ', result);
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
        Object.keys(details.options).length
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
                  <Txt className='text-[15px] mt-[25px]'>{details.name}</Txt>
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
              {details.info['가격']}
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
