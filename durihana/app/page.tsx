import BottomNavigation from '@/components/atoms/BottomNavigation';
import Header from '@/components/atoms/Header';
import TestAccountCreator from '@/components/test/TestAccountCreator';

export default function Home() {
  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <TestAccountCreator userId={1} />
      <BottomNavigation selectedItem='home' />
    </>
  );
}
