'use client';

import { useState } from 'react';
import { formatDisplayDate } from '@/lib/utils';
import { CalendarDrawer } from './CalendarDrawer';
import AlertModal from './alert/AlertModal';
import Button from './atoms/Button';
import Txt from './atoms/Txt';

type Props = {
  partnerServiceId: number;
};

export default function ReservationComponent({ partnerServiceId }: Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedInfo, setConfirmedInfo] = useState<{
    date: Date;
    time: string;
  } | null>(null);

  const handleReservationConfirm = (date: Date, time: string) => {
    console.log('예약 정보:', {
      partnerServiceId,
      date,
      time,
    });
    // 실제 예약 처리 로직 추가
    setConfirmedInfo({ date, time });
    setShowSuccessModal(true);
  };

  return (
    <>
      <CalendarDrawer
        partnerServiceId={partnerServiceId}
        triggerLabel='예약하기'
        onConfirm={handleReservationConfirm}
      />

      {showSuccessModal && confirmedInfo && (
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
                {formatDisplayDate(confirmedInfo.date)}
              </Txt>
              <Txt size='text-[16px]' className='text-mainblack'>
                {` ${confirmedInfo.time}`}
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
