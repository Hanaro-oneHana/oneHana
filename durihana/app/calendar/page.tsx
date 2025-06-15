import BottomNavigation from '@/components/atoms/BottomNavigation';
import UserCalendar from '@/components/schedule/UserCalendar';

export default function Calendar() {
  return (
    <>
      <UserCalendar userId={1} />
      <BottomNavigation selectedItem='calendar' />
    </>
  );
}
