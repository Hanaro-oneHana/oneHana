import ReservationComponent from '@/components/ReservationComponent';
import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';

export default function Home() {
  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <ReservationComponent />
      <BottomNavigation selectedItem='home' />
    </>
  );
}
