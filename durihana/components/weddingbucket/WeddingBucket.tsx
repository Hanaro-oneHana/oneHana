'use client';

import { Header, Button, Txt } from '@/components/atoms';
import WeddingBucketBox from '@/components/weddingbucket/WeddingBucketBox';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import AlertModal from '../alert/AlertModal';

export type Option = {
  optionTitle: string;
  optionContent: string;
};

export type BucketItem = {
  id: number;
  store?: string;
  options?: Option[];
  price?: number;
  state?: number;
  category?: number;
};

type Props = {
  items: BucketItem[];
};

export default function WeddingBucket({ items }: Props) {
  const router = useRouter();
  const categories = ['예식장', '스드메', '신혼여행', '가전·가구', '예물·예단'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const before = useSearchParams().get('before');

  return (
    <div className='flex flex-col items-center justify-start w-full pt-[60px]'>
      <Header
        title='웨딩 버켓'
        leftIcon='back'
        rightIcon='close'
        onRightClick={() => router.back()}
      />
      <div className='flex flex-col items-start justify-start w-full px-[25px] pt-[20px] pb-[40px] gap-[30px]'>
        {categories.map((category, index) => (
          <div key={index} className='flex flex-col gap-[10px] w-full'>
            <Txt className='text-[16px] font-[500] '>{category}</Txt>

            {(() => {
              const filteredItems = items?.filter(
                (item) => item.category === index + 1
              );
              return filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <WeddingBucketBox key={item.id} item={item} />
                ))
              ) : (
                <Txt className='text-[14px] text-textgray font-[500] rounded-[10px] px-[20px] py-[15px] bg-mainwhite shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]'>
                  내용이 없습니다
                </Txt>
              );
            })()}
          </div>
        ))}
        <div className='flex items-center justify-between w-full'>
          <Txt
            align='text-center'
            color='text-primarycolor'
            size='text-[20px]'
            weight='font-[500]'
          >
            총 견적
          </Txt>
          <Txt
            align='text-center'
            color='text-primarycolor'
            size='text-[20px]'
            weight='font-[500]'
          >
            {(items ?? [])
              .reduce((total, item) => total + (item.price || 0), 0)
              .toLocaleString()}{' '}
            원
          </Txt>
        </div>
        {before && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Txt
              size='text-[16px]'
              weight='font-[500]'
              color='text-mainwhite'
              align='text-center'
            >
              완료
            </Txt>
          </Button>
        )}
      </div>
      {isModalOpen && (
        <AlertModal onClose={() => setIsModalOpen(false)}>
          <Txt align='text-center' weight='font-[600]'>
            선택하신 웨딩 견적에 맞춰 <br /> 신혼부부를 위한 <br /> 하나은행의
            맞춤 <span className='text-primarycolor'>예적금·대출 서비스</span>로{' '}
            <br /> 결혼 부담을 덜어보세요!
          </Txt>
          <div className='flex flex-row items-center justify-center gap-[15px] w-full mt-[25px]'>
            <Button
              bgColor='bg-icon'
              onClick={() => {
                setIsModalOpen(false);
                router.push('/');
              }}
              className='py-[10px]'
            >
              홈으로
            </Button>
            <Button
              bgColor='bg-primarycolor'
              onClick={() => {
                setIsModalOpen(false);
                router.push('/account/else-account');
              }}
              className='py-[10px]'
            >
              확인
            </Button>
          </div>
        </AlertModal>
      )}
    </div>
  );
}
