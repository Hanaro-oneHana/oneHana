'use client';

import Image from 'next/image';
import { useState } from 'react';
import ProgressBarButton from '../ProgressBarButton';
import Button from '../atoms/Button';
import Search from '../atoms/Search';
import Txt from '../atoms/Txt';
import DomesticFiltering from '../filtering/DomesticFiltering';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import StoreCard from './StoreCard';

export default function EstimateMain() {
  const [sortOption, setSortOption] = useState('가격순');
  const items = [
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
    {
      name: '두리 하나 스토어',
      location: '서울특별시',
      priceRange: '5000만원~5500만원',
      capacity: '250명',
    },
  ];
  return (
    <div className='relative flex flex-col items-center justify-center h-dvh'>
      <div className='flex flex-col items-center justify-start w-full flex-none'>
        <div className='flex flex-col w-full items-center justify-start gap-[30px] pt-[25px] px-[20px] '>
          <ProgressBarButton selectedItem={1} progress={true} />
          <Search
            onSearch={(query: string) => {
              console.log('Search query:', query);
            }}
          />
        </div>
        <div className='flex mt-[20px] w-full'>
          <DomesticFiltering
            onChange={(regions: string[]): void => {
              console.log('Selected regions:', regions);
            }}
          />
        </div>
        <div className='flex flex-row items-center justify-end w-full px-[20px]'>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className=' mt-[20px]'>
              <div className='flex items-center justify-center gap-[-2px] focus:outline-none  m-0 p-0'>
                <Txt size='text-[12px]' color='text-textgray'>
                  {sortOption}
                </Txt>
                <Image
                  src='/asset/icons/down-shevron.svg'
                  alt='DownShevron'
                  width={20}
                  height={20}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-auto'>
              <DropdownMenuItem onSelect={() => setSortOption('가격순')}>
                <Txt size='text-[12px]' color='text-textgray'>
                  가격순
                </Txt>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSortOption('인기순')}>
                <Txt size='text-[12px]' color='text-textgray'>
                  인기순
                </Txt>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='flex flex-col flex-1 items-center justify-start w-full overflow-y-scroll px-[20px] pt-[20px] gap-[10px] '>
        {items.map((item, index) => (
          <StoreCard key={index} />
        ))}
      </div>

      <div className='flex flex-row flex-none  items-center bg-transparent justify-center w-full px-[20px] mt-[20px] gap-[15px] mb-[40px]'>
        <Button bgColor='bg-icon'>건너뛰기</Button>
        <Button onClick={() => console.log('Another button clicked!')}>
          다음 단계
        </Button>
      </div>
    </div>
  );
}
