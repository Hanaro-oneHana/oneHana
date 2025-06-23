import Image from 'next/image';
import { calculateDday } from '@/lib/utils';
import { Txt } from '../atoms';

type Props = {
  date: string;
  category: string[];
};

const checklist = [
  {
    keyword: '예식장',
    todoText: '예식장 상담 예약하기',
    doneText: '예식장 상담 예약 완료',
  },
  {
    keyword: '스드메',
    todoText: '스드메 상담 예약하기',
    doneText: '스드메 상담 예약 완료',
  },
  {
    keyword: '여행',
    todoText: '신혼여행 상담 예약하기',
    doneText: '신혼여행 상담 예약 완료',
  },
  {
    keyword: '가전',
    todoText: '가전·가구 구매하기',
    doneText: '가전·가구 구매 완료',
  },
  {
    keyword: '예물',
    todoText: '예물·예단 구매하기',
    doneText: '예물·예단 구매 완료',
  },
];

export default function MainDashBoard({ date, category }: Props) {
  const dDay = calculateDday(date);

  const isDone = (keyword: string) => category.some((c) => c.includes(keyword));

  return (
    <>
      <div className='flex flex-col w-full'>
        <Txt size='text-[18px]' weight='font-[500]' className='mb-[20px]'>
          나의 결혼 준비
        </Txt>
      </div>
      <div className='w-full bg-lightpurple rounded-[10px] border border-linegray flex justify-between'>
        <div className='pt-[29px] pl-[20px]'>
          <Txt weight='font-[600]'>
            {dDay === null
              ? '결혼 예정일이 없어요'
              : dDay > 0
                ? `D-${dDay}`
                : dDay < 0
                  ? `D+${-dDay}`
                  : '오늘 결혼해요'}
          </Txt>

          <div className='flex flex-col gap-[4px] mt-[25px] mb-[34px]'>
            {checklist.map(({ keyword, todoText, doneText }) => {
              const done = isDone(keyword);

              return (
                <div key={keyword} className='flex items-center gap-[4px]'>
                  <Image
                    src={`/asset/icons/${done ? 'check-active.svg' : 'check-inactive.svg'}`}
                    alt={`체크 ${done ? '완료' : '미완료'}`}
                    width={16}
                    height={16}
                  />
                  <Txt
                    size='text-[12px]'
                    color={done ? 'text-primarycolor' : 'text-icongray'}
                  >
                    {done ? doneText : todoText}
                  </Txt>
                </div>
              );
            })}
          </div>
        </div>

        <Image
          src='/asset/icons/flower-dashboard.svg'
          alt='꽃다발'
          width={138}
          height={138}
          className='shrink-0 aspect-[118.25/118.25] rotate-[23.132deg] mr-[25px]'
        />
      </div>
    </>
  );
}
