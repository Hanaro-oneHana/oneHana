'use client';

import { CalendarDrawer } from '@/components/calendar';
import { useState } from 'react';
import { formatDisplayDate } from '@/lib/utils';
import AlertModal from '../alert/AlertModal';
import { Button, Txt } from '../atoms';

type Props = {
  partnerServiceId: number;
};

export default function ReservationComponent({ partnerServiceId }: Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedInfo, setConfirmedInfo] = useState<{
    date: Date;
    time: string;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleReservationConfirm}
      />

      {showSuccessModal && confirmedInfo && (
        <AlertModal onClose={() => setShowSuccessModal(false)}>
          <div className='flex flex-col items-center space-y-4 text-center'>
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
              className='bg-primarycolor text-mainwhite mt-4 w-full'
            >
              확인
            </Button>
          </div>
        </AlertModal>
      )}
    </>
  );
}
