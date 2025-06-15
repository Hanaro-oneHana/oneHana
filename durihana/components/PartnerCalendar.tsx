import { CalendarDrawer } from './CalendarDrawer';

type Props = {
  partnerServiceId: number;
};

export default function PartnerCalendar({ partnerServiceId }: Props) {
  return (
    <CalendarDrawer
      partnerServiceId={partnerServiceId}
      triggerLabel='상담 일정 보기'
      viewOnly
    />
  );
}
