'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { deleteBucketItem } from '@/lib/actions/StoreActions';
import { Button, Txt } from '../atoms';
import { BucketItem } from './WeddingBucket';

type Props = {
  item: BucketItem;
};

export default function WeddingBucketBox({ item }: Props) {
  const router = useRouter();
  const bucketState = ['예약', '예약완료', '결제', '결제완료'];
  const handleDelete = async () => {
    console.log(`Deleting item with id: ${item.id}`);
    try {
      await deleteBucketItem(item.id);
      router.refresh();
    } catch (error) {
      console.error('아이템 삭제 중 오류 발생', error);
    }
  };

  return (
    <div className='flex flex-col gap-[10px] rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]'>
      <div className='relative flex items-center justify-between p-[20px] bg-mainwhite rounded-[10px]'>
        <Button
          className='absolute bg-transparent p-0 top-[15px] right-[15px] w-fit h-fit leading-none'
          onClick={handleDelete}
        >
          <Image
            src={`/asset/icons/close.svg`}
            alt={`Close Icon`}
            width={16}
            height={16}
          />
        </Button>
        <div className='flex flex-col gap-[20px] w-full'>
          <Txt className='text-[16px] font-[500]'>{item.store}</Txt>
          <div className='flex flex-col items-center w-full gap-[4px]'>
            {item.options?.map((option, idx) => (
              <div
                key={idx}
                className='flex items-center justify-between text-[14px] text-textgray font-[500] w-full'
              >
                <Txt size='text-[12px]' weight='font-[500]'>
                  {option.optionTitle}
                </Txt>
                <Txt
                  size='text-[12px]'
                  weight='font-[500]'
                  color='text-textgray'
                >
                  {option.optionContent}
                </Txt>
              </div>
            ))}
          </div>
          <div className='flex items-center justify-end w-full gap-[20px]'>
            <Txt
              size='text-[16px]'
              weight='font-[500]'
              color='text-primarycolor'
            >
              {item.price?.toLocaleString()} 원
            </Txt>
            <Button
              className='w-fit h-fit px-[10px] py-[9px] leading-[10px] '
              bgColor={
                item.state === 0 || item.state === 2
                  ? 'bg-mint'
                  : 'bg-accountgray'
              }
              disabled={item.state === 1 || item.state === 3}
            >
              <Txt size='text-[12px]' weight='font-[500]' align='text-center'>
                {bucketState[item.state || 0]}
              </Txt>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
