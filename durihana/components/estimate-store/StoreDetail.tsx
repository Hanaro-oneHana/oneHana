'use client';

import AlertModal from '@/components/alert/AlertModal';
import { Button, Txt } from '@/components/atoms';
import CalendarDrawer from '@/components/calendar/CalendarDrawer';
import StoreDrawer from '@/components/estimate-store/StoreDrawer';
import StoreInfo from '@/components/estimate-store/StoreInfo';
import StoreOption from '@/components/estimate-store/StoreOption';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  insertOptions,
  StoreDetailProps,
} from '@/lib/actions/StoreDetailActions';

/* eslint-disable @next/next/no-img-element */

export const modalMent = [
  '모든 옵션을 선택해 주세요',
  '웨딩버켓 담기완료!',
  '결제완료!',
];

export default function StoreDetail(details: StoreDetailProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [modal, showModal] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  //categoryid 가 1,2,3 (예식장, 스드메, 신혼여행) state : 0 <- 예약해야함 / 1 <- 예약완료
  // 4, 5 가 (가전가구, 예물예단) state: 2 <- 결제해야함 / state: 3 <- 결제완료
  const state = details.categoryId < 4 ? 0 : 2;

  const userId = Number(session?.user?.id);

  const [selectedModalMent, setSelectedModalMent] = useState<
    (typeof modalMent)[number]
  >(modalMent[0]);

  //캐러셀 슬라이드 위한 것
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleAdd = async () => {
    // 담기 선택했을 때의 함수
    const requiredKeys = Object.keys(details.options);
    const hasUnselected = requiredKeys.some((key) => !selectedOptions[key]);
    const isSelectOption =
      Object.keys(details.options).length > 0 && hasUnselected;

    if (hasUnselected && details.options) {
      showModal(true);
      return;
    }

    try {
      const requestUser = session?.user?.isMain
        ? parseInt(session?.user?.id || '0', 10)
        : session?.user?.partnerId || 0;

      //insertOptions 에서 categoryId 에 따라 budgetPlan 의 state 들어가는거 다름
      await insertOptions(requestUser || 0, details.id, selectedOptions, state);
      if (isSelectOption) {
        setSelectedModalMent(modalMent[0]);
      } else {
        setSelectedModalMent(modalMent[1]);
      }
      showModal(true);
    } catch (error) {
      console.error('옵션 저장 실패:', error);
      alert('담기 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className='flex w-full flex-col items-center'>
        <div>
          <Carousel setApi={setApi}>
            <div className='bg-icongray absolute top-2 right-4 z-10 rounded px-2 py-1 text-[12px] text-white opacity-90'>
              {current}/{count}
            </div>
            <CarouselContent>
              {details.images.map((src, index) => (
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
      </div>

      <div className='flex w-full flex-col px-[20px] pt-[25px]'>
        <Txt size='text-[20px]' weight='font-[500]'>
          {details?.name}
        </Txt>

        {'위치' in details.info && (
          <div className='mt-[5px] flex items-center gap-[4px]'>
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

      <div className='bg-background fixed bottom-0 left-[50%] z-50 flex h-[80px] w-full max-w-[960px] translate-x-[-50%] items-center justify-between gap-[15px] px-[20px]'>
        {details.categoryId < 4 ? (
          <Button
            className='bg-buttongray h-[48px] w-full'
            onClick={() => setCalendarOpen(true)}
          >
            상담일정 보기
          </Button>
        ) : (
          <StoreDrawer
            details={details}
            selectedOptions={selectedOptions}
            onselectedOptions={() => showModal(true)}
            userId={userId}
            onSelectModalMent={setSelectedModalMent}
          />
        )}
        <Button className='h-[48px] w-full' onClick={handleAdd}>
          담기
        </Button>
      </div>

      {modal && (
        <AlertModal
          onClose={() => {
            showModal(false);
          }}
        >
          <Txt align='text-center'>{selectedModalMent}</Txt>
          <div className='mt-5 flex w-full flex-row gap-[15px]'>
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
                웨딩버켓 가기
              </Button>
            )}
            <Button
              onClick={() => {
                showModal(false);
                // 예시: handleAdd 내부 혹은 해당 로직이 위치한 곳에 적용
                const optionKeys = Object.keys(details.options);

                // 1) categoryId 가 3 이면 즉시 뒤로가기
                if (details.categoryId === 3) {
                  router.back();
                  return;
                }

                // 2) 아니면 옵션이 있고, 모든 옵션이 선택되었을 때만 뒤로가기
                if (
                  optionKeys.length > 0 &&
                  optionKeys.every((key) => !!selectedOptions[key])
                ) {
                  router.back();
                }
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
    </>
  );
}
