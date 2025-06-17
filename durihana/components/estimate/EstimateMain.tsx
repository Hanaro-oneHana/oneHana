'use client';

import ProgressBarButton from '@/components/ProgressBarButton';
import { Txt, Search, Button } from '@/components/atoms';
import StoreCard from '@/components/estimate/StoreCard';
import DomesticFiltering from '@/components/filtering/DomesticFiltering';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Store } from '@/lib/actions/StoreActions';

type Props = {
  storeList?: Store[];
  categoryId?: number;
};

export default function EstimateMain({ storeList, categoryId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParam = (key: string[], value: string[]) => {
    const params = new URLSearchParams(searchParams);
    key.forEach((k, index) => {
      params.set(k, value[index]);
    });
    router.push(`?${params.toString()}`);
    router.refresh();
  };

  const [sortOption, setSortOption] = useState('가격순');
  const [items, setItems] = useState<Store[]>(storeList || []);
  const [category, setCategory] = useState(categoryId || 1);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  useEffect(() => {
    setItems(storeList || []);
    setCategory(categoryId || 1);
  }, [searchParams, storeList, categoryId]);

  useEffect(() => {
    updateSearchParam(['category', 'search'], [category.toString(), '']);
  }, [category]);

  useEffect(() => {
    if (selectedRegions.length > 0) {
      const filteredItems =
        storeList?.filter((item) => selectedRegions.includes(item.location)) ||
        [];
      setItems(filteredItems);
    } else {
      setItems(storeList || []);
    }
  }, [selectedRegions]);

  return (
    <div className='relative flex flex-col items-center justify-center h-dvh'>
      <div className='flex flex-col items-center justify-start w-full flex-none'>
        <div className='flex flex-col w-full items-center justify-start gap-[30px] pt-[25px] px-[20px]'>
          <ProgressBarButton
            selectedItem={category}
            setSelectedItem={setCategory}
            progress={true}
          />
          <Search
            onSearch={(query: string) => {
              updateSearchParam(['search'], [query]);
            }}
          />
        </div>
        <div className='flex mt-[20px] w-full'>
          <DomesticFiltering
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
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
              <DropdownMenuItem
                onSelect={() => {
                  setItems([...items].sort((a, b) => a.price - b.price));
                  setSortOption('가격순');
                }}
              >
                <Txt size='text-[12px]' color='text-textgray'>
                  가격순
                </Txt>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setSortOption('인기순');
                  items.sort((a, b) => b.popular - a.popular);
                }}
              >
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
          <StoreCard key={index} store={item} />
        ))}
      </div>

      <div className='flex flex-row flex-none items-center bg-transparent justify-center w-full px-[20px] mt-[20px] mb-[40px]'>
        <Button
          onClick={() => {
            updateSearchParam(
              ['category', 'search'],
              [(categoryId ? categoryId + 1 : 0).toString(), '']
            );
          }}
        >
          {categoryId === 5 ? '완료' : '다음'}
        </Button>
      </div>
      <button className='absolute bottom-[108px] right-[20px] p-[10px] rounded-full bg-mint shadow-[2px_4px_6px_0px_rgba(0,0,0,0.10)] cursor-pointer'>
        <Image
          src='/asset/icons/bucket.svg'
          alt='Bucket'
          width={30}
          height={30}
          onClick={() => {
            router.push('/wedding-bucket');
          }}
        />
      </button>
    </div>
  );
}
