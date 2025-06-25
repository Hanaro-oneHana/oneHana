import CalendarComponent from '../atoms/CalendarComponent';
import TimeSlotList from './TimeSlotList';

type DrawerContentProps = {
  selectedDate?: Date;
  blockedDates: Date[];
  calendarMonth: number;
  calendarYear: number;
  times: string[];
  reservedTimes: string[];
  availableTimes: string[];
  selectedTime?: string;
  viewOnly: boolean;
  onDateSelect: (date: Date) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onTimeSelect: (time: string) => void;
};

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
