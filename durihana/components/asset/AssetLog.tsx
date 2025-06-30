'use client';

import { CategoryData } from '@/types/Asset';
import { useRouter } from 'next/navigation';
import { Button } from '../atoms';
import Txt from '../atoms/Txt';

type Props = {
  data: CategoryData[];
};

export default function AssetLog({ data }: Props) {
  const router = useRouter();

  const goToWeddingBucket = () => router.push('/wedding-bucket');

  const isEmpty = data.length === 0;

  return (
    <>
      <div className='flex w-full flex-col'>
        <Txt size='text-[18px]' className='mb-[8px] ml-[5px]'>
          웨딩 카테고리별 지출
        </Txt>
        {isEmpty ? (
          <div className='bg-accountgray w-full rounded-[10px] px-[20px] py-[30px] text-center'>
            <Txt size='text-[14px]'>현재 등록된 지출 내역이 없습니다.</Txt>
            <Button
              onClick={goToWeddingBucket}
              bgColor='bg-purple'
              textColor='text-mainblack'
              className='mt-[25px]'
            >
              웨딩 버켓에서 결제하기
            </Button>
          </div>
        ) : (
          <div className='bg-accountgray flex w-full flex-col gap-y-[15px] rounded-[10px] px-[20px] py-[15px]'>
            {data.map((entry, index) => (
              <div
                key={index}
                className='bg-mainwhite flex h-[40px] items-center rounded-[10px]'
              >
                <Txt size='text-[12px]' className='ml-[10px]'>
                  {entry.category}
                </Txt>
                <Txt className='mr-[10px] ml-auto'>{`${entry.value.toLocaleString('ko-KR')} 원`}</Txt>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
