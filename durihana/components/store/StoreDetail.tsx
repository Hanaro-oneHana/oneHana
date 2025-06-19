'use client';

import { Button, Txt } from '@/components/atoms';
import StoreInfo from '@/components/store/StoreInfo';
import StoreOption, { optionConfig } from '@/components/store/StoreOption';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { insertOptions } from '@/lib/actions/StoreDetailActions';
import { JsonValue } from '@/lib/generated/prisma/runtime/library';
import AlertModal from '../alert/AlertModal';

export type StoreDetailProps = {
  id: number;
  name: string;
  content: JsonValue;
  partner: {
    address: string;
    partnercategory: {
      type: string;
    };
  };
};

export default function StoreDetail(details: StoreDetailProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const contentBody = StoreInfo(details);
  const [modal, showModal] = useState(false);
  const router = useRouter();

  //테스트용 이미지
  const images = [
    '/asset/images/wedding-hall.svg',
    '/asset/images/wedding-hall2.svg',
    '/asset/images/wedding-hall3.svg',
  ];

  const handleAdd = async () => {
    const user_id = 1;
    const partnerServiceId = details.id;
    const type = details.partner.partnercategory.type;

    const requiredKeys = optionConfig[type]?.map(({ key }) => key) || [];
    const hasUnselected = requiredKeys.some((key) => !selectedOptions[key]);

    if (hasUnselected && type !== '여행') {
      showModal(true);
      return;
    }

    try {
      await insertOptions(user_id, partnerServiceId, selectedOptions);
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
                  alt={'image-${index}'}
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
        <StoreOption {...details} onSelectChange={setSelectedOptions} />
      </div>

      <div
        className='fixed bottom-0 left-0 w-full h-[80px] bg-background z-50 
        flex items-center justify-between px-[20px] gap-[15px]'
      >
        {/* 이 Button 에 추후 onClick 함수 달아야함 */}
        <Button className='bg-buttongray h-[48px] w-full'>
          상담 일정 보기
        </Button>
        <Button
          className='h-[48px] w-full'
          onClick={() => {
            handleAdd();
            showModal(true);
          }}
        >
          담기
        </Button>

        {modal && (
          <AlertModal
            onClose={() => {
              showModal(false);
              router.back();
            }}
          >
            <Txt align='text-center'>
              {details.partner.partnercategory.type !== '여행' &&
              optionConfig[details.partner.partnercategory.type]?.some(
                ({ key }) => !selectedOptions[key]
              )
                ? '모든 옵션을 선택해주세요'
                : '웨딩버켓에 담기 완료!'}
            </Txt>
            <Button
              className='mt-5'
              onClick={() => {
                showModal(false);
                // router.back();
              }}
            >
              확인
            </Button>
          </AlertModal>
        )}
      </div>
    </div>
  );
}
