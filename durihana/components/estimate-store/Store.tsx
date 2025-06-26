'use client';

import { Search, Txt } from '@/components/atoms';
import { StoreCard, ProgressBarButton } from '@/components/estimate-store';
import Filtering from '@/components/filtering/Filtering';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  domesticRegions,
  foreignRegions,
  PriceOption,
} from '@/constants/filtering';
import { Store } from '@/types/Store';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getFilteringOptions } from '@/lib/utils';

type Props = {
  storeList: Store[];
  categoryId?: number;
};

export default function StoreComponent({ storeList, categoryId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortOptionList, setSortOptionList] = useState<PriceOption[]>([]);
  const [sortOption, setSortOption] = useState<PriceOption | null>(null);
  const [category, setCategory] = useState(categoryId || 1);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [items, setItems] = useState<Store[]>(storeList || []);

  const updateSearchParam = (key: string[], value: string[]) => {
    const params = new URLSearchParams(searchParams);
    key.forEach((k, index) => {
      params.set(k, value[index]);
    });
    router.push(`?${params.toString()}`);
    router.refresh();
  };

  const handlePriceFilter = (price: number, isLast: boolean) => {
    const filteredItems =
      storeList?.filter((item) =>
        isLast ? item.price >= price * 10000 : item.price <= price * 10000
      ) || [];
    setItems(filteredItems);
  };

  const handleSearch = useCallback((query: string) => {
    updateSearchParam(['search'], [query]);
  }, []);

  useEffect(() => {
    setItems(storeList || []);
    setCategory(categoryId || 1);
  }, [searchParams, storeList, categoryId]);

  useEffect(() => {
    updateSearchParam(['category', 'search'], [category.toString(), '']);
    setSortOptionList(getFilteringOptions(category));
  }, [category]);

  useEffect(() => {
    if (selectedRegions.length > 0) {
      const filteredItems =
        storeList?.filter((item) =>
          selectedRegions.some((region) => item.location.includes(region))
        ) || [];
      setItems(filteredItems);
    } else {
      setItems(storeList || []);
    }
  }, [selectedRegions, storeList]);

  return (
    <>
      <div className='flex w-full flex-col gap-[25px] px-[20px]'>
        <ProgressBarButton
          selectedItem={category}
          setSelectedItem={setCategory}
          progress={false}
        />
        <Search onSearch={handleSearch} />
      </div>
      {category !== 4 && category !== 5 && (
        <div className='flex w-full flex-col pt-[20px]'>
          <Filtering
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            regions={
              category === 1 || category === 2
                ? domesticRegions
                : foreignRegions
            }
          />
        </div>
      )}

      <div className='flex w-full items-center justify-end px-[20px]'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className='mt-[20px]'>
            <div className='m-0 flex items-center justify-center gap-[-2px] p-0 focus:outline-none'>
              <Txt size='text-[12px]' color='text-textgray'>
                {sortOption ? sortOption.label : '전체'}
              </Txt>
              <Image
                src='/asset/icons/down-shevron.svg'
                alt='DownShevron'
                width={20}
                height={20}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex min-w-auto flex-col items-end'>
            {sortOptionList.map((option, index) => (
              <DropdownMenuItem
                key={index}
                onSelect={() => {
                  if (option.value === 0) {
                    setItems(storeList || []);
                    setSortOption(sortOptionList[0]);
                    updateSearchParam(['search'], ['']);
                  } else {
                    setSortOption(option);
                    handlePriceFilter(
                      option.value,
                      index === sortOptionList.length - 1
                    );
                  }
                }}
              >
                <Txt
                  size='text-[12px]'
                  color='text-textgray'
                  align='text-center'
                >
                  {option.label}
                </Txt>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='scrollbar-hide flex w-full flex-col items-center justify-start gap-[10px] overflow-y-auto px-[20px] py-[20px]'>
        {items.length === 0 ? (
          <Txt size='text-[14px]' className='text-icongray' align='text-center'>
            해당되는 상품이 없습니다.
          </Txt>
        ) : (
          items.map((item, index) => <StoreCard key={index} store={item} />)
        )}
      </div>
      <button className='bg-mint fixed right-[20px] bottom-[92.5px] cursor-pointer rounded-full p-[10px] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.10)]'>
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
    </>
  );
}
