'use client';

import { useRouter } from 'next/navigation';
import { Store } from '@/lib/actions/StoreActions';
import Txt from '../atoms/Txt';

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
      className='flex flex-row items-center justify-start w-full border-b-[1px] border-linegray gap-[20px] pb-[20px]'
    >
      <img
        src={
          store?.images && store.images.length > 0
            ? store.images[0]
            : '/asset/images/store-default.png'
        }
        className='rounded-[10px] object-cover min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]'
        alt='Store Image'
      />
      <div className='flex flex-col items-start justify-center w-full gap-[5px]'>
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
