export type CalendarDayProps = {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isBlocked: boolean;
  hasFinanceSchedule: boolean;
  hasReservationSchedule: boolean;
  showScheduleDots: boolean;
  onDateSelect: (date: Date) => void;
  variant?: 'page' | 'drawer';
};

export type CalendarGridProps = {
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

export type DrawerContentProps = {
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

export type CalendarHeaderProps = {
  currentMonth: number;
  currentYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthSelect: (month: number) => void;
  onYearSelect: (year: number) => void;
  variant?: 'page' | 'drawer';
};

export interface CalendarDrawerProps {
  partnerServiceId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewOnly?: boolean; // 조회 전용 모드
  onConfirm?: (date: Date, time: string) => void; // 예약 모드일 때 콜백
}

export type TimeSlotListProps = {
  times: string[];
  reservedTimes: string[];
  availableTimes: string[];
  selectedTime?: string;
  viewOnly: boolean;
  onTimeSelect: (time: string) => void;
};
