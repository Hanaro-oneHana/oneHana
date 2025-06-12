import BottomNavigation from '@/components/atoms/BottomNavigation';
import Txt from '@/components/atoms/Txt';

export default function Home() {
  return (
    <>
      <Txt size='text-[11px]' weight='font-[600]' color='text-icon'>
        홈
      </Txt>
      <BottomNavigation />
    </>
  );
}
