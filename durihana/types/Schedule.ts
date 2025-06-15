export type Schedule = {
  id: number;
  title: string;
  date: Date;
  time: string;
  type: 'reservation' | 'finance';
  partnerName?: string;
};

export type ScheduleProps = {
  userId: number;
};
