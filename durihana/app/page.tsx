import BottomNavigation from '@/components/atoms/BottomNavigation';
import Dropdown from '@/components/atoms/Dropdown';
import Header from '@/components/atoms/Header';

export default function Home() {
  const items: [string, string][] = [
    ['뷔페', '50,000원'],
    ['한식', '20,500원'],
    ['도시락', '15,000원'],
  ];

  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <BottomNavigation selectedItem='home' />

      <Dropdown items={items} defaultTitle="식사 옵션" />
    </>
  );
}
