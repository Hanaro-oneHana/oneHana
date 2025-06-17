import Image from 'next/image';
import { use } from 'react';
import { getStoreDetail } from '@/lib/actions/StoreDetailActions';
import {
  WeddingHallContent,
  SDMContent,
  HoneymoonContent,
} from '@/lib/storeTypes';

type Props = {
  params: Promise<{ storeId: string }>;
};

export default function StoreId({ params }: Props) {
  const { storeId } = use(params);
  const detail = use(getStoreDetail(Number(storeId)));
  let content = detail?.content;
  const type = detail?.partner?.partnercategory?.type;

  if (type === '예식장') {
    content = content as WeddingHallContent;
  } else if (type === '스드메') {
    content = content as SDMContent;
  } else if (type === '허니문') {
    content = content as HoneymoonContent;
  }

  return (
    <>
      <div>
        <div className='flex flex-col w-full items-center'>
          <Image
            src='/asset/images/wedding-hall.svg'
            alt='웨딩홀1'
            width={375}
            height={300}
          />
        </div>

        <div>
          <p>{detail?.name}</p>
          <p>{}</p>
        </div>
      </div>
    </>
  );
}
