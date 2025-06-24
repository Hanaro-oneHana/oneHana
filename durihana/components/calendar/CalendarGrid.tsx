import CalendarDay from './CalendarDay';

type CalendarGridProps = {
  calendarDays: Array<{ date: Date; isCurrentMonth: boolean }>;
  selectedDate: Date;
  blockedDates: Date[];
  financeScheduleDates: Date[];
  reservationScheduleDates: Date[];
  showScheduleDots: boolean;
  onDateSelect: (date: Date) => void;
  isSameDay: (d1: Date, d2: Date) => boolean;
  variant?: 'page' | 'drawer';
};

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export default function CalendarGrid({
  calendarDays,
  selectedDate,
  blockedDates,
  financeScheduleDates,
  reservationScheduleDates,
  showScheduleDots,
  onDateSelect,
  isSameDay,
  variant = 'page',
}: CalendarGridProps) {
  const hasFinanceSchedule = (date: Date) => {
    return financeScheduleDates.some((scheduleDate) =>
      isSameDay(scheduleDate, date)
    );
  };

  const hasReservationSchedule = (date: Date) => {
    return reservationScheduleDates.some((scheduleDate) =>
      isSameDay(scheduleDate, date)
    );
  };

  const handleDateSelect = (date: Date) => {
    if (blockedDates.some((bd) => isSameDay(bd, date))) return;
    onDateSelect(date);
  };

  return (
    <>
      {/* 요일 */}
      <div className='grid grid-cols-7 mb-2'>
        {weekDays.map((wd) => (
          <div key={wd} className='text-center text-[12px] weight-[500] py-2'>
            {wd}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className='grid grid-cols-7 gap-1'>
        {calendarDays.map((dayObj, idx) => {
          const { date, isCurrentMonth } = dayObj;
          const isSelected = isSameDay(date, selectedDate);
          const isBlocked = blockedDates.some((bd) => isSameDay(bd, date));
          const hasFinanceScheduleOnDate = hasFinanceSchedule(date);
          const hasReservationScheduleOnDate = hasReservationSchedule(date);

          return (
            <CalendarDay
              variant={variant}
              key={idx}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              isBlocked={isBlocked}
              hasFinanceSchedule={hasFinanceScheduleOnDate}
              hasReservationSchedule={hasReservationScheduleOnDate}
              showScheduleDots={showScheduleDots}
              onDateSelect={handleDateSelect}
            />
          );
        })}
      </div>
    </>
  );
}
