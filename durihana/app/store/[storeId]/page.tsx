import { Button, Txt } from '@/components/atoms';
import StoreInfo from '@/components/store/storeInfo';
import StoreOption from '@/components/store/storeOption';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { use } from 'react';
import { getStoreDetail } from '@/lib/actions/StoreDetailActions';

type Props = {
  params: Promise<{ storeId: string }>;
};

export default function StoreId({ params }: Props) {
  const { storeId } = use(params);
  const details = use(getStoreDetail(Number(storeId)));

  const contentBody = StoreInfo(details);

  //더미 이미지
  const images = [
    '/asset/images/wedding-hall.svg',
    '/asset/images/wedding-hall2.svg',
    '/asset/images/wedding-hall3.svg',
  ];

  return (
    <div className='h-dvh overflow-y-auto pb-[100px]'>
      <div className='flex flex-col w-full items-center'>
        <Carousel>
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem
                key={index}
                className='relative flex w-full items-center'
              >
                <Image
                  src={src}
                  alt={`image-${index}`}
                  width={0}
                  height={0}
                  className='w-full'
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className='flex flex-col px-[20px] pt-[25px] w-full'>
        {/* 여기는 공통된 부분 */}
        <Txt size='text-[20px]' weight='font-[500]'>
          {details?.name}
        </Txt>
        <div className='flex'>
          <Image
            src='/asset/icons/mapmarker.svg'
            alt='맵마커'
            width={16}
            height={16}
          />
          <Txt size='text-[13px]' weight='font-[500]' color='text-textgray'>
            {details?.partner?.address}
          </Txt>
        </div>
      </div>
      <div className='flex flex-col w-full'>{contentBody}</div>

      <hr className='mt-[20px] mb-[20px] w-full' />

      <div className='flex flex-col w-full'>
        <StoreOption {...details} />
      </div>

      <div
        className='fixed bottom-0 left-0 w-full h-[80px] bg-background z-50 
        flex items-center justify-between px-[20px] gap-[15px]'
      >
        <Button className='bg-buttongray h-[48px] w-full'>
          상담 일정 보기
        </Button>
        <Button className='h-[48px] w-full'>담기</Button>
      </div>
    </div>
  );
}
