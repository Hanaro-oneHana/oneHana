import PartnerCalendar from '@/components/PartnerCalendar';
import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';

export default function Home() {
  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <PartnerCalendar />
      <BottomNavigation selectedItem='home' />
    </>
  );
}
