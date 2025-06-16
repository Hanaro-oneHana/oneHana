import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';
import PartnerCalendar from '@/components/calendar/PartnerCalendar';
import ReservationComponent from '@/components/reservation/ReservationComponent';
import TestAccountCreator from '@/components/test/TestAccountCreator';

export default function Home() {
  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <TestAccountCreator userId={1} />
      <PartnerCalendar partnerServiceId={1} />
      <BottomNavigation selectedItem='home' />
    </>
  );
}
