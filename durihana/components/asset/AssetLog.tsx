'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../atoms';
import Txt from '../atoms/Txt';

type Props = {
  data: { name: string; value: number }[];
};

export default function AssetLog({ data }: Props) {
  const router = useRouter();

  const goToWeddingBucket = () => router.push('/wedding-bucket');

  const isEmpty = data.length === 0;

  return (
    <>
      <div className='flex flex-col w-full'>
        <Txt size='text-[18px]' className='mb-[8px] ml-[5px]'>
          웨딩 카테고리별 지출
        </Txt>
        {isEmpty ? (
          <div className='w-full bg-accountgray rounded-[10px] px-[20px] py-[30px] text-center'>
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
          <div className='w-full bg-accountgray rounded-[10px] px-[20px] py-[15px] flex flex-col gap-y-[15px]'>
            {data.map((entry, index) => (
              <div
                key={index}
                className='flex items-center h-[40px] bg-mainwhite rounded-[10px]'
              >
                <Txt size='text-[12px]' className='ml-[10px]'>
                  {entry.name}
                </Txt>
                <Txt className='ml-auto mr-[10px]'>{`${entry.value.toLocaleString('ko-KR')} 원`}</Txt>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
