'use client';

import { Button, Txt } from '../atoms';
import HorizontalSlider from '../atoms/HorizontalSlider';

type TimeSlotListProps = {
  times: string[];
  reservedTimes: string[];
  availableTimes: string[];
  selectedTime?: string;
  viewOnly: boolean;
  onTimeSelect: (time: string) => void;
};

export default function TimeSlotList({
  times,
  reservedTimes,
  availableTimes,
  selectedTime,
  viewOnly,
  onTimeSelect,
}: TimeSlotListProps) {
  return (
    <div className='space-y-3'>
      <Txt
        weight={viewOnly ? 'font-[500]' : 'font-[400]'}
        size={viewOnly ? undefined : 'text-[15px]'}
        className='ml-[8px]'
      >
        상담 가능 시간
      </Txt>
      <HorizontalSlider className='px-0'>
        <div className='flex gap-[9px]'>
          {times.map((time) => {
            const isReserved = reservedTimes.includes(time);
            const isAvailable = availableTimes.includes(time);
            console.log('🚀 ~ {times.map ~ isAvailable:', isAvailable);

            if (viewOnly) {
              // 조회 모드: Txt로 표시, 예약된 시간은 흐리게
              return (
                <Txt
                  key={time}
                  className={`
                    px-[11px] py-[8px] rounded-10px text-[12px] font-normal whitespace-nowrap
                    transition-colors duration-200
                    ${isReserved ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {time}
                </Txt>
              );
            } else {
              // 예약 모드: Button으로 표시, 클릭 가능
              return (
                <Button
                  key={time}
                  onClick={() => onTimeSelect(time)}
                  disabled={isReserved}
                  className={`
                    px-[11px] py-[8px] rounded-10px text-[12px] font-normal
                    transition-colors duration-200
                    ${
                      isReserved
                        ? 'bg-linegray text-mainblack opacity-50 cursor-not-allowed'
                        : selectedTime === time
                          ? 'bg-primaryhalf text-mainblack'
                          : 'bg-linegray text-mainblack'
                    }
                  `}
                >
                  {time}
                </Button>
              );
            }
          })}
        </div>
      </HorizontalSlider>
    </div>
  );
}
