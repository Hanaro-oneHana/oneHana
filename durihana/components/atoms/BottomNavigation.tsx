'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Txt from './Txt';

export default function BottomNavigation({
  selectedItem,
}: {
  selectedItem?: string;
}) {
  const navigationItems = [
    {
      name: 'home',
      title: '홈',
      icon: '/asset/icons/home.svg',
      activeIcon: '/asset/icons/home-active.svg',
    },
    {
      name: 'store',
      title: '제휴처',
      icon: '/asset/icons/store.svg',
      activeIcon: '/asset/icons/store-active.svg',
    },
    {
      name: 'asset',
      title: '자산',
      icon: '/asset/icons/asset.svg',
      activeIcon: '/asset/icons/asset-active.svg',
    },
    {
      name: 'calendar',
      title: '일정',
      icon: '/asset/icons/calendar.svg',
      activeIcon: '/asset/icons/calendar-active.svg',
    },
    {
      name: 'menu',
      title: '메뉴',
      icon: '/asset/icons/menu.svg',
      activeIcon: '/asset/icons/menu-active.svg',
    },
  ];
  const [selected, setSelected] = useState(
    selectedItem || navigationItems[0].name
  );
  const router = useRouter();

  const handleNavigation = (name: string) => {
    setSelected(name);
    if (name === 'home') {
      router.push('/');
      return;
    }
    router.push(`/${name}`);
  };
  return (
    <div className='fixed bottom-0 left-[50%] translate-x-[-50%] max-w-[960px] flex w-dvw bg-mainwhite  items-center justify-around l'>
      {navigationItems.map((item) => (
        <button
          key={item.name}
          className='flex flex-col items-center gap-[3px] pt-[14px] pb-[15px] px-[23px] cursor-pointer'
          onClick={() => handleNavigation(item.name)}
        >
          <Image
            src={selected === item.name ? item.activeIcon : item.icon}
            alt={item.name}
            width={24}
            height={24}
          />
          <Txt
            size='text-[11px]'
            weight='font-[600]'
            color={selected === item.name ? 'text-primarycolor' : 'text-icon'}
          >
            {item.title}
          </Txt>
        </button>
      ))}
    </div>
  );
}
