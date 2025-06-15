import UserCalendar from '@/components/UserCalendar';
import BottomNavigation from '@/components/atoms/BottomNavigation';

export default function Calendar() {
  return (
    <>
      <UserCalendar userId={1} />
      <BottomNavigation selectedItem='calendar' />
    </>
  );
}
