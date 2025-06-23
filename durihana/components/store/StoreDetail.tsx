'use client';

import AlertModal from '@/components/alert/AlertModal';
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
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  insertOptions,
  StoreDetailProps,
} from '@/lib/actions/StoreDetailActions';
import CalendarDrawer from '../calendar/CalendarDrawer';

/* eslint-disable @next/next/no-img-element */

export default function StoreDetail(details: StoreDetailProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [modal, showModal] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleAdd = async () => {
    const requiredKeys = Object.keys(details.options);
    const hasUnselected = requiredKeys.some((key) => !selectedOptions[key]);

    if (hasUnselected && details.options) {
      showModal(true);
      return;
    }

    try {
      const bucketState =
        details.type === '가전·가구' || details.type === '예물' ? 2 : 0;
      const requestUser = session?.user?.isMain
        ? parseInt(session?.user?.id || '0', 10)
        : session?.user?.partnerId || 0;
      await insertOptions(
        requestUser || 0,
        details.id,
        selectedOptions,
        bucketState
      );
      showModal(true);
    } catch (error) {
      console.error('옵션 저장 실패:', error);
      alert('담기 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className=' pb-[100px]'>
      <div className='flex flex-col w-full items-center'>
        <Carousel>
          <CarouselContent>
            {details.images?.map((src, index) => (
              <CarouselItem
                key={index}
                className='relative flex w-full items-center'
              >
                <img src={src} alt={`image-${index}`} className='w-full' />
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

      <div className='fixed max-w-[960px]  bottom-0 left-[50%] translate-x-[-50%] w-full h-[80px] bg-background z-50 flex items-center justify-between px-[20px] gap-[15px]'>
        <Button
          className='bg-buttongray h-[48px] w-full'
          onClick={() => setCalendarOpen(true)}
        >
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
          <div className='flex flex-row gap-[15px] mt-5 w-full'>
            {!Object.keys(details.options).some(
              (key) => !selectedOptions[key]
            ) && (
              <Button
                bgColor='bg-icon'
                onClick={() => {
                  showModal(false);
                  router.push('/wedding-bucket');
                }}
              >
                장바구니 가기
              </Button>
            )}
            <Button
              onClick={() => {
                showModal(false);
                Object.keys(details.options).length > 0 &&
                  !Object.keys(details.options).some(
                    (key) => !selectedOptions[key]
                  ) &&
                  router.back();
              }}
            >
              확인
            </Button>
          </div>
        </AlertModal>
      )}
      <CalendarDrawer
        partnerServiceId={details.id}
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        viewOnly
      />
    </div>
  );
}
