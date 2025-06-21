import { Header, Button, Txt } from '@/components/atoms';
import WeddingBucketBox from '@/components/weddingbucket/WeddingBucketBox';

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
  items?: BucketItem[];
};

export default function WeddingBucket({ items }: Props) {
  const categories = ['예식장', '스드메', '신혼여행', '가전·가구', '예물·예단'];

  return (
    <div className='flex flex-col items-center justify-start w-full pt-[60px]'>
      <Header title='웨딩 버켓' leftIcon='back' rightIcon='close' />
      <div className='flex flex-col items-start justify-start w-full px-[25px] pt-[20px] pb-[40px] gap-[30px]'>
        {categories.map((category, index) => (
          <div key={index} className='flex flex-col gap-[10px] w-full'>
            <Txt className='text-[16px] font-[500] '>{category}</Txt>
            <div className='flex flex-col gap-[10px] rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]'>
              <div className='relative flex items-center justify-between p-[20px] bg-mainwhite rounded-[10px]'>
                {(() => {
                  const filteredItems = items?.filter(
                    (item) => item.category === index + 1
                  );
                  return filteredItems && filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <WeddingBucketBox
                        key={item.id}
                        items={filteredItems}
                        index={idx}
                      />
                    ))
                  ) : (
                    <Txt className='text-[14px] text-textgray font-[500]'>
                      내용이 없습니다
                    </Txt>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
        <div className='flex items-center justify-between w-full '>
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
        <Button>
          <Txt
            size='text-[16px]'
            weight='font-[500]'
            color='text-mainwhite'
            align='text-center'
          >
            완료
          </Txt>
        </Button>
      </div>
    </div>
  );
}
