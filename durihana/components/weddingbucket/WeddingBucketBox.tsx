'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { getCheckingAccountByUserId } from '@/lib/actions/AccountActions';
import { addPartnerCalendarEvent } from '@/lib/actions/ReservationActions';
import { deleteBucketItem, updateBudgetPlan } from '@/lib/actions/StoreActions';
import { minusBalance } from '@/lib/actions/calBalance';
import { Button, Txt } from '../atoms';
import CalendarDrawer from '../calendar/CalendarDrawer';
import { BucketItem } from './WeddingBucket';

type Props = { item: BucketItem };

export default function WeddingBucketBox({ item }: Props) {
  const { data: session } = useSession();
  const userId = Number(session?.user?.id) ?? 0;
  const router = useRouter();
  console.log('f;asdkjf;lksdjf;', item);

  // 로컬 상태로 UI 즉시 갱신
  const [currentState, setCurrentState] = useState<number>(item.state ?? 0);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const bucketLabels = ['예약', '예약완료', '결제', '결제완료'];

  // 1) 달력에서 날짜·시간 선택 후 “예약하기” 클릭 시
  const handleReservation = async (date: Date, time: string) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`; // "2025-07-01"
    const accountId = await getCheckingAccountByUserId(userId);

    await minusBalance(accountId, Number(item.price), item.store);
    // 1-1) partnerCalendar에 예약 이벤트 기록
    await addPartnerCalendarEvent(userId, item.id, dateStr, time);

    // 1-2) BudgetPlan 상태=1(예약완료), selected에 date/time 저장
    await updateBudgetPlan(item.id, 1);

    setCurrentState(1);
    setCalendarOpen(false);
  };

  // 2) “결제하기” 버튼 클릭 시
  const handlePayment = async () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`; // ex: "2025-06-24"
    const timeStr = `${hh}:00`; // ex: "14:00"
    const accountId = await getCheckingAccountByUserId(userId);
    await minusBalance(accountId, Number(item.price), item.store);

    // 2-1) partnerCalendar에 결제 이벤트 기록
    await addPartnerCalendarEvent(userId, item.id, dateStr, timeStr);

    // 2-2) BudgetPlan 상태=3(결제완료), selected는 그대로 둠
    await updateBudgetPlan(item.id, 3);

    setCurrentState(3);
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
        {(item.state === 0 || item.state === 2) && (
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
        )}

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
              className='w-fit h-fit px-[10px] py-[9px] leading-[10px]'
              onClick={() => {
                if (currentState === 2) {
                  handlePayment();
                } else {
                  setCalendarOpen(true);
                }
              }}
              bgColor={
                currentState === 0 || currentState === 2
                  ? 'bg-mint'
                  : 'bg-accountgray'
              }
              disabled={currentState === 1 || currentState === 3}
            >
              <Txt size='text-[12px]' weight='font-[500]' align='text-center'>
                {bucketLabels[currentState]}
              </Txt>
            </Button>
          </div>
        </div>
      </div>
      <CalendarDrawer
        partnerServiceId={item.partnerServiceId}
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        viewOnly={false}
        onConfirm={handleReservation}
      />
    </div>
  );
}
