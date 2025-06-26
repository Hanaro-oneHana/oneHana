'use client';

import { Txt } from '@/components/atoms';
import { Store } from '@/types/Store';
import { useRouter } from 'next/navigation';

/* eslint-disable @next/next/no-img-element */

type Props = {
  store?: Store;
};

export default function StoreCard({ store }: Props) {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push(`/store/${store?.id}`);
      }}
      className='border-linegray flex w-full flex-row items-center justify-start gap-[20px] border-b-[1px] pb-[20px]'
    >
      <img
        src={
          store?.images && store.images.length > 0
            ? store.images[0]
            : '/asset/images/store-default.png'
        }
        className='max-h-[60px] min-h-[60px] max-w-[60px] min-w-[60px] rounded-[10px] object-cover'
        alt='Store Image'
      />
      <div className='flex w-full flex-col items-start justify-center gap-[5px]'>
        <Txt size='text-[14px]' weight='font-[500]'>
          {store?.name || '가게 이름'}
        </Txt>
        {store?.destination ? (
          <Txt size='text-[10px]' weight='font-[400]' color='text-textgray'>
            {store.destination}
          </Txt>
        ) : store?.modelId ? (
          <Txt size='text-[10px]' weight='font-[400]' color='text-textgray'>
            {`모델명: ${store.modelId}`}
          </Txt>
        ) : store?.description ? (
          <Txt size='text-[10px]' weight='font-[400]' color='text-textgray'>
            {`${store.description}`}
          </Txt>
        ) : (
          <Txt size='text-[10px]' weight='font-[400]' color='text-textgray'>
            {store?.location || '가게 위치'}
          </Txt>
        )}

        <Txt size='text-[10px]' weight='font-[400]' color='text-textgray'>
          {store?.price
            ? `${store.price.toLocaleString()}원`
            : '가격 정보 없음'}
        </Txt>
      </div>
    </div>
  );
}
