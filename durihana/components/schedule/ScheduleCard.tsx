import { ScheduleCardProps } from '@/types/Schedule';
import Image from 'next/image';
import { formatDisplayDate } from '@/lib/utils';
import Txt from '../atoms/Txt';

export default function ScheduleCard({
  schedule,
  keyPrefix,
}: ScheduleCardProps) {
  // 금액 포맷팅 함수
  const formatAmount = (amount: number, isExpiry: boolean) => {
    const formattedAmount = amount.toLocaleString('ko-KR');
    if (isExpiry) {
      return `+${formattedAmount} 원`;
    } else {
      return `-${formattedAmount} 원`;
    }
  };

  const isExpiry = schedule.title.includes('만료');

  return (
    <div
      key={`${keyPrefix}-${schedule.id}`}
      className='rounded-[10px] border border-gray-100 bg-white p-4 shadow-sm'
    >
      {/* 제목과 금액 (금융 일정인 경우) */}
      <div className='mb-3 flex items-start justify-between'>
        <Txt size='text-[12px]' weight='font-[400]' className='text-mainblack'>
          {schedule.title}
        </Txt>
        {schedule.type === 'finance' && schedule.amount !== undefined && (
          <Txt
            size='text-[12px]'
            weight='font-[400]'
            className='text-mainblack'
          >
            {formatAmount(schedule.amount, isExpiry)}
          </Txt>
        )}
      </div>

      <div className='space-y-2'>
        <div className='flex items-center gap-3'>
          <Image
            src='/asset/icons/calendar-line.svg'
            alt='calendar'
            width={16}
            height={16}
          />
          {schedule.type === 'reservation' ? (
            <Txt size='text-[10px]' className='text-textgray'>
              {formatDisplayDate(schedule.date)} {schedule.time}
            </Txt>
          ) : (
            <Txt size='text-[10px]' className='text-textgray'>
              {formatDisplayDate(schedule.date)}
            </Txt>
          )}
        </div>

        {/* 예약일정인 경우만 파트너 정보 표시 */}
        {schedule.type === 'reservation' && schedule.partnerName && (
          <div className='flex items-center gap-3'>
            <Image
              src='/asset/icons/map.svg'
              alt='location'
              width={16}
              height={16}
            />
            <Txt size='text-[10px]' className='text-textgray'>
              {schedule.partnerName}
            </Txt>
          </div>
        )}
      </div>
    </div>
  );
}
