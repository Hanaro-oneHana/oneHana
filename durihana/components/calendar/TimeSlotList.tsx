'use client';

import Button from '../atoms/Button';
import HorizontalSlider from '../atoms/HorizontalSlider';
import Txt from '../atoms/Txt';

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
        <div className='flex'>
          {times.map((time) => {
            const isReserved = reservedTimes.includes(time);
            const isAvailable = availableTimes.includes(time);

            if (viewOnly) {
              // 조회 모드: Txt로 표시, 예약된 시간은 흐리게
              return (
                <Txt
                  key={time}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
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
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
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
