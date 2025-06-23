'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { deleteBucketItem } from '@/lib/actions/StoreActions';
import { Button, Txt } from '../atoms';
import CalendarDrawer from '../calendar/CalendarDrawer';
import { BucketItem } from './WeddingBucket';

type Props = {
  item: BucketItem;
};

export default function WeddingBucketBox({ item }: Props) {
  const router = useRouter();
  const [currentState, setCurrentState] = useState(item.state);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const bucketState = ['예약', '예약완료', '결제', '결제완료'];
  // 캘린더에서 확인 눌렀을 때 호출되는 콜백
  const handleReservation = async (date: Date, time: string) => {
    try {
      // 1) partnerCalendar에 일정 추가
      await addPartnerCalendarEvent(item.id, { date, time });
      // 2) 웨딩버켓 state 업데이트(API 호출 + 로컬 반영)
      await updateBucketItemState(item.id, { state: 1 });
      setCurrentState(1);
      setCalendarOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 결제 버튼 눌렀을 때 호출
  const handlePayment = async () => {
    try {
      await updateBucketItemState(item.id, { state: 3 });
      setCurrentState(3);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async () => {
    console.log(`Deleting item with id: ${item.id}`);
    try {
      await deleteBucketItem(item.id);
      router.refresh();
    } catch (error) {
      console.error('아이템 삭제 중 오류 발생', error);
    }
  };

  return (
    <div className='flex flex-col gap-[10px] rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]'>
      <div className='relative flex items-center justify-between p-[20px] bg-mainwhite rounded-[10px]'>
        <Button
          className='absolute bg-transparent p-0 top-[15px] right-[15px] w-fit h-fit leading-none'
          onClick={handleDelete}
        >
          <Image
            src={`/asset/icons/close.svg`}
            alt={`Close Icon`}
            width={16}
            height={16}
          />
        </Button>
        <div className='flex flex-col gap-[20px] w-full'>
          <Txt className='text-[16px] font-[500]'>{item.store}</Txt>
          <div className='flex flex-col items-center w-full gap-[4px]'>
            {item.options?.map((option, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between text-[14px] text-textgray font-[500] w-full'
              >
                <Txt size='text-[12px]' weight='font-[500]'>
                  {option.optionTitle}
                </Txt>
                <Txt
                  size='text-[12px]'
                  weight='font-[500]'
                  color='text-textgray'
                >
                  {option.optionContent}
                </Txt>
              </div>
            ))}
          </div>
          <div className='flex items-center justify-end w-full gap-[20px]'>
            <Txt
              size='text-[16px]'
              weight='font-[500]'
              color='text-primarycolor'
            >
              {item.price?.toLocaleString()} 원
            </Txt>
            <Button
              onClick={() => setCalendarOpen(true)}
              bgColor={
                currentState === 0 || currentState === 2
                  ? 'bg-mint'
                  : 'bg-accountgray'
              }
              disabled={currentState === 1 || currentState === 3}
            >
              <Txt>{bucketLabels[currentState]}</Txt>
            </Button>

            {/* 결제 모드(state=2)일 때만 */}
            {currentState === 2 && (
              <Button onClick={handlePayment} className='ml-2'>
                결제완료 처리
              </Button>
            )}
          </div>
        </div>
      </div>
      <CalendarDrawer
        partnerServiceId={item.id}
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        viewOnly={false}
        onConfirm={handleReservation} // ← 여기 연결
      />
    </div>
  );
}
