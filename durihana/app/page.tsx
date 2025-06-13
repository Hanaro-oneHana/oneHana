import BottomNavigation from '@/components/atoms/BottomNavigation';
import Dropdown from '@/components/atoms/Dropdown';
import Header from '@/components/atoms/Header';

export default function Home() {
  const items: string[] = [
    'showmethemoney', 'blackshipwall', 'poweroverwelming'
  ];

  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <BottomNavigation selectedItem='home' />

      <Dropdown defaultTitle='치트키' items={items} width='w-[325px]' bgColor='bg-primarycolor'/>
    </>
  );
}
