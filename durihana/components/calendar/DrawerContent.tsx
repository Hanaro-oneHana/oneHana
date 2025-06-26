import { DrawerContentProps } from '@/types/Calendar';
import CalendarComponent from '../atoms/CalendarComponent';
import TimeSlotList from './TimeSlotList';

export default function DrawerContent({
  selectedDate,
  blockedDates,
  calendarMonth,
  calendarYear,
  times,
  reservedTimes,
  availableTimes,
  selectedTime,
  viewOnly,
  onDateSelect,
  onMonthChange,
  onYearChange,
  onTimeSelect,
}: DrawerContentProps) {
  return (
    <div className='space-y-6 px-4 pb-4'>
      <div className='space-y-4'>
        <div className='mx-auto w-full max-w-sm'>
          <CalendarComponent
            variant='drawer'
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            blockedDates={blockedDates}
            currentMonth={calendarMonth}
            currentYear={calendarYear}
            onMonthChange={onMonthChange}
            onYearChange={onYearChange}
          />
        </div>
      </div>

      <TimeSlotList
        times={times}
        reservedTimes={reservedTimes}
        availableTimes={availableTimes}
        selectedTime={selectedTime}
        viewOnly={viewOnly}
        onTimeSelect={onTimeSelect}
      />
    </div>
  );
}
