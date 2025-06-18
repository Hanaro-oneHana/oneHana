import Image from 'next/image';
import { Store } from '@/lib/actions/StoreActions';
import Txt from '../atoms/Txt';

type Props = {
  store?: Store;
};

export default function StoreCard({ store }: Props) {
  return (
    <div className='flex flex-row items-center justify-start w-full border-b-[1px] border-linegray gap-[20px] pb-[20px]'>
      <Image
        src='/asset/icons/default-store.svg'
        alt='Store Image'
        width={60}
        height={60}
      />
      <div className='flex flex-col items-start justify-center w-full gap-[5px]'>
        <Txt size='text-[14px]' weight='font-[500]'>
          {store?.name || '가게 이름'}
        </Txt>
        <Txt size='text-[10px]' weight='font-[400]' color='text-textgray'>
          {store?.location || '가게 위치'}
        </Txt>
        <Txt size='text-[10px]' weight='font-[400]' color='text-textgray'>
          {store?.price ? `${store.price}원` : '가격 정보 없음'}
        </Txt>
      </div>
    </div>
  );
}
