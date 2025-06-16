import { ACCOUNT_TYPES, Schedule } from '@/types/Schedule';
import Image from 'next/image';
import { formatDisplayDate } from '@/lib/utils';
import Txt from '../atoms/Txt';

type ScheduleCardProps = {
  schedule: Schedule;
  keyPrefix: string;
};

export default function ScheduleCard({
  schedule,
  keyPrefix,
}: ScheduleCardProps) {
  return (
    <div
      key={`${keyPrefix}-${schedule.id}`}
      className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'
    >
      <Txt
        size='text-[16px]'
        weight='font-[500]'
        className='text-mainblack mb-3'
      >
        {schedule.title}
      </Txt>
      <div className='space-y-2'>
        <div className='flex items-center gap-3'>
          <Image
            src='/asset/icons/calendar-line.svg'
            alt='calendar'
            width={16}
            height={16}
          />
          <Txt size='text-[14px]' className='text-gray-600'>
            {formatDisplayDate(schedule.date)} {schedule.time}
          </Txt>
        </div>
        {/* 예약일정인 경우 파트너 정보 표시, 금융일정인 경우 계좌 타입 정보 표시 */}
        <div className='flex items-center gap-3'>
          <Image
            src='/asset/icons/map.svg'
            alt='location'
            width={16}
            height={16}
          />
          <Txt size='text-[14px]' className='text-gray-600'>
            {schedule.type === 'reservation'
              ? schedule.partnerName
              : schedule.accountType !== undefined
                ? `${ACCOUNT_TYPES[schedule.accountType as keyof typeof ACCOUNT_TYPES]} 관련`
                : '금융 일정'}
          </Txt>
        </div>
      </div>
    </div>
  );
}
