// StoreDetail.tsx
'use client';

import { Button, Txt } from '@/components/atoms';
import StoreInfo from '@/components/store/StoreInfo';
import StoreOption from '@/components/store/StoreOption';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  insertOptions,
  StoreDetailProps,
} from '@/lib/actions/StoreDetailActions';
import AlertModal from '../alert/AlertModal';

// StoreDetail.tsx

export default function StoreDetail(details: StoreDetailProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [modal, showModal] = useState(false);
  const router = useRouter();

  // 테스트용 이미지
  const images = [
    '/asset/images/wedding-hall.svg',
    '/asset/images/wedding-hall2.svg',
    '/asset/images/wedding-hall3.svg',
  ];

  const handleAdd = async () => {
    const user_id = 1; // 테스트용 사용자 id
    const requiredKeys = Object.keys(details.options);
    const hasUnselected = requiredKeys.some((key) => !selectedOptions[key]);

    if (hasUnselected && details.options) {
      showModal(true);
      return;
    }

    try {
      await insertOptions(user_id, details.id, selectedOptions);
      showModal(true);
    } catch (error) {
      console.error('옵션 저장 실패:', error);
      alert('담기 중 오류가 발생했습니다.');
    }
  };

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
        <Txt size='text-[20px]' weight='font-[500]'>
          {details?.name}
        </Txt>

        {'위치' in details.info && (
          <div className='flex items-center gap-[4px] mt-[5px]'>
            <Image
              src='/asset/icons/mapmarker.svg'
              alt='맵마커'
              width={16}
              height={16}
            />
            <Txt size='text-[13px]' weight='font-[500]' color='text-textgray'>
              {details.info['위치']}
            </Txt>
          </div>
        )}
      </div>

      <StoreInfo info={details.info} />

      <hr className='my-[20px] w-full' />

      <StoreOption
        options={details.options}
        onSelectChange={(opts) => setSelectedOptions(opts)}
      />

      <div className='fixed bottom-0 left-0 w-full h-[80px] bg-background z-50 flex items-center justify-between px-[20px] gap-[15px]'>
        <Button className='bg-buttongray h-[48px] w-full'>
          상담 일정 보기
        </Button>
        <Button className='h-[48px] w-full' onClick={handleAdd}>
          담기
        </Button>
      </div>

      {modal && (
        <AlertModal
          onClose={() => {
            showModal(false);
            router.back();
          }}
        >
          <Txt align='text-center'>
            {Object.keys(details.options).length > 0 &&
            Object.keys(details.options).some((key) => !selectedOptions[key])
              ? '모든 옵션을 선택해주세요'
              : '웨딩버켓에 담기 완료!'}
          </Txt>
          <Button className='mt-5' onClick={() => showModal(false)}>
            확인
          </Button>
        </AlertModal>
      )}
    </div>
  );
}
