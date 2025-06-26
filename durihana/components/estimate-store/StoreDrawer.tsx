'use client';

import { Button, Txt } from '@/components/atoms';
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
import { modalMent } from '@/constants/store';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { getCheckingAccountByUserId } from '@/lib/actions/AccountActions';
import { addPartnerCalendarEvent } from '@/lib/actions/ReservationActions';
import {
  insertOptions,
  StoreDetailProps,
} from '@/lib/actions/StoreDetailActions';
import { minusBalance } from '@/lib/actions/calBalance';

/* eslint-disable @next/next/no-img-element */

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
  const router = useRouter();
  const { data: session } = useSession();
  const img = details.images;
  const [open, setOpen] = useState(false);
  const requestUser = session?.user?.isMain
    ? parseInt(session?.user?.id || '0', 10)
    : session?.user?.partnerId || 0;

  const price = parseInt(details.info['가격'].replace(/[^0-9]/g, ''), 10);

  const handlePayment = async () => {
    try {
      const accountId = await getCheckingAccountByUserId(userId);

      const description = details.name;

      //minusBalance 함수에서 transaction 테이블에도 기록해줌
      const result = await minusBalance(accountId, price, description);
      await addPartnerCalendarEvent(requestUser, details.id, '', '');
      // Storedrawer 는 가전가구, 예물예단이니까 결제 완료 되면 budgetPlan 의 state 가 3으로 변경
      if (result.success) {
        const insertResult = await insertOptions(
          requestUser,
          details.id,
          selectedOptions,
          3
        );
        if (insertResult) {
          onSelectModalMent(modalMent[2]);
          onselectedOptions();
        }
      }
    } catch (e) {
      console.error('결제 실패', e);
      alert('결제 중 오류가 발생했습니다.');
    }
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!userId) {
      router.push('/auth/unauthorized');
      return;
    }
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
                <div className='relative mb-[20px] flex w-full gap-[20px]'>
                  <img
                    src={img[0]}
                    alt='Store image'
                    width={60}
                    height={60}
                    className='rounded-lg object-cover'
                  />
                  <Txt className='mt-[25px] text-[15px]'>{details.name}</Txt>
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
              <ul className='list-inside list-none'>
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
