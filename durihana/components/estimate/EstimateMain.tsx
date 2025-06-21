'use client';

import ProgressBarButton from '@/components/ProgressBarButton';
import { Txt, Search, Button } from '@/components/atoms';
import StoreCard from '@/components/estimate/StoreCard';
import Filtering from '@/components/filtering/Filtering';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  domesticRegions,
  electronicPriceOptions,
  foreignRegions,
  honeyMoonPriceOptions,
  PriceOption,
  sdmPriceOptions,
  weddingGiftPriceOptions,
  weddinghallPriceOptions,
} from '@/constants/filtering';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Store } from '@/lib/actions/StoreActions';
import AlertModal from '../alert/AlertModal';

type Props = {
  storeList?: Store[];
  categoryId?: number;
};

export default function EstimateMain({ storeList, categoryId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortOptionList, setSortOptionList] = useState<PriceOption[]>([]);
  const [items, setItems] = useState<Store[]>(storeList || []);
  const [category, setCategory] = useState(categoryId || 1);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    setItems(storeList || []);
    setCategory(categoryId || 1);
  }, [searchParams, storeList, categoryId]);

  useEffect(() => {
    updateSearchParam(['category', 'search'], [category.toString(), '']);
    switch (category) {
      case 1:
        setSortOptionList(weddinghallPriceOptions);
        break;
      case 2:
        setSortOptionList(sdmPriceOptions);
        break;
      case 3:
        setSortOptionList(honeyMoonPriceOptions);
        break;
      case 4:
        setSortOptionList(electronicPriceOptions);
        break;
      case 5:
        setSortOptionList(weddingGiftPriceOptions);
        break;
      default:
        setSortOptionList([]);
        break;
    }
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
        {category !== 4 && category !== 5 && (
          <div className='flex flex-col w-full pt-[20px]'>
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
        <div className='flex flex-row items-center justify-end w-full px-[20px]'>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className=' mt-[20px]'>
              <div className='flex items-center justify-center gap-[-2px] focus:outline-none  m-0 p-0'>
                <Txt size='text-[12px]' color='text-textgray'>
                  {sortOptionList.length > 0 ? sortOptionList[0].label : '전체'}
                </Txt>
                <Image
                  src='/asset/icons/down-shevron.svg'
                  alt='DownShevron'
                  width={20}
                  height={20}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex flex-col items-end min-w-auto'>
              {sortOptionList.map((option, index) => (
                <DropdownMenuItem
                  key={index}
                  onSelect={() => {
                    if (option.value === 0) {
                      setItems(storeList || []);
                      updateSearchParam(['search'], ['']);
                    } else {
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
      </div>
      <div className='flex flex-col flex-1 items-center justify-start w-full overflow-y-scroll px-[20px] pt-[20px] gap-[10px] '>
        {items.map((item, index) => (
          <StoreCard key={index} store={item} />
        ))}
      </div>

      <div className='flex flex-row flex-none items-center bg-transparent justify-center w-full px-[20px] mt-[20px] mb-[40px]'>
        <Button
          onClick={() => {
            if (categoryId === 5) {
              router.push('/wedding-bucket');
            } else {
              updateSearchParam(
                ['category', 'search'],
                [(categoryId ? categoryId + 1 : 0).toString(), '']
              );
            }
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
