import { Header, Button, Txt } from '@/components/atoms';
import Image from 'next/image';

type Option = {
  optionTitle: string;
  optionContent: string;
};

export default function WeddingBucket() {
  const categories = ['예식장', '스드메', '신혼여행', '가전·가구', '예물·예단'];
  const items: Array<{
    id: number;
    store?: string;
    options?: Array<Option>;
    price?: number;
    state?: string;
  }> = [
    {
      id: 1,
      store: '럭셔리웨딩홀',
      options: [
        { optionTitle: '장소', optionContent: '서울 강남구' },
        { optionTitle: '식대', optionContent: '70,000원' },
        { optionTitle: '인원', optionContent: '100명' },
      ],
      price: 100000,
      state: '예약완료',
    },
    {
      id: 2,
      store: '웨딩샵',
      options: [
        { optionTitle: '턱시도 옵션1', optionContent: '설명1' },
        { optionTitle: '턱시도 옵션2', optionContent: '설명2' },
      ],
      price: 150000,
      state: '예약대기중',
    },
    {
      id: 3,
      store: '하나투어',
      options: [
        { optionTitle: '항공권', optionContent: '왕복 항공권' },
        { optionTitle: '숙박', optionContent: '5성급 호텔' },
      ],
      price: 50000,
      state: '예약완료',
    },
  ];
  return (
    <div className='flex flex-col items-center justify-start w-full pt-[60px]'>
      <Header title='웨딩 버켓' leftIcon='back' rightIcon='close' />
      <div className='flex flex-col items-start justify-start w-full px-[25px] pt-[20px] pb-[40px] gap-[30px]'>
        {categories.map((category, index) => (
          <div key={index} className='flex flex-col gap-[10px] w-full'>
            <Txt className='text-[16px] font-[500] '>{category}</Txt>
            <div className='flex flex-col gap-[10px] rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]'>
              <div className='relative flex items-center justify-between p-[20px] bg-mainwhite rounded-[10px]'>
                {items.find((item) => item.id === index + 1) ? (
                  <>
                    <Button className='absolute bg-transparent p-0 top-[15px] right-[15px] w-fit h-fit leading-none'>
                      <Image
                        src={`/asset/icons/close.svg`}
                        alt={`Close Icon`}
                        width={16}
                        height={16}
                      />
                    </Button>
                    <div className='flex flex-col gap-[20px] w-full'>
                      <Txt className='text-[16px] font-[500]'>
                        {items[index].store}
                      </Txt>
                      <div className='flex flex-col items-center w-full gap-[4px]'>
                        {items[index].options?.map((option, idx) => (
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
                          {items[index].price?.toLocaleString()} 원
                        </Txt>
                        <Button className='w-fit h-fit px-[10px] py-[7px] bg-mint leading-none'>
                          <Txt size='text-[12px]' weight='font-[500]'>
                            {items[index].state}
                          </Txt>
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Txt className='text-[14px] text-textgray font-[500]'>
                    내용이 없습니다
                  </Txt>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className='flex items-center justify-between w-full '>
          <Txt className='text-[20px] text-primarycolor font-[500]'>
            총 견적
          </Txt>
          <Txt className='text-[20px] text-primarycolor font-[500]'>
            {items
              .reduce((total, item) => total + (item.price || 0), 0)
              .toLocaleString()}{' '}
            원
          </Txt>
        </div>
        <Button>
          <Txt size='text-[16px]' weight='font-[500]' color='text-mainwhite'>
            완료
          </Txt>
        </Button>
      </div>
    </div>
  );
}
