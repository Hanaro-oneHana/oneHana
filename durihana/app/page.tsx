import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';
import ReservationComponent from '@/components/reservation/ReservationComponent';
import TestAccountCreator from '@/components/test/TestAccountCreator';

export default function Home() {
  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <TestAccountCreator userId={1} />
      <ReservationComponent partnerServiceId={1} />
      <BottomNavigation selectedItem='home' />
    </>
  );
}
