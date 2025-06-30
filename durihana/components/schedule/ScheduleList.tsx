import { ScheduleListProps } from '@/types/Schedule';
import { formatDisplayDate } from '@/lib/utils';
import Txt from '../atoms/Txt';
import ScheduleCard from './ScheduleCard';

export default function ScheduleList({
  loading,
  selectedDate,
  reservationSchedules,
  financeSchedules,
}: ScheduleListProps) {
  if (loading) {
    return (
      <div className='py-8 text-center'>
        <Txt size='text-[14px]' className='text-icongray' align='text-center'>
          일정을 불러오는 중...
        </Txt>
      </div>
    );
  }

  const hasSchedules =
    reservationSchedules.length > 0 || financeSchedules.length > 0;

  if (!hasSchedules) {
    return (
      <div className='py-12 text-center'>
        <Txt size='text-[14px]' className='text-icongray' align='text-center'>
          {formatDisplayDate(selectedDate)}에 일정이 없습니다.
        </Txt>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {reservationSchedules.length > 0 && (
        <div className='space-y-4'>
          <Txt size='text-[14px]' className='text-mainblack'>
            예약일정
          </Txt>
          <div className='space-y-3'>
            {reservationSchedules.map((schedule) => (
              <ScheduleCard
                key={`reservation-${schedule.id}`}
                schedule={schedule}
                keyPrefix='reservation'
              />
            ))}
          </div>
        </div>
      )}

      {financeSchedules.length > 0 && (
        <div className='space-y-4'>
          <Txt size='text-[14px]' className='text-mainblack'>
            금융
          </Txt>
          <div className='space-y-3'>
            {financeSchedules.map((schedule) => (
              <ScheduleCard
                key={`finance-${schedule.id}`}
                schedule={schedule}
                keyPrefix='finance'
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
