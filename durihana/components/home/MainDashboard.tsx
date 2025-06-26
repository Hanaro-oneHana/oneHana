'use client';

import { checklist } from '@/constants/dashboard';
import { CategoryData } from '@/types/Asset';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { calculateDday } from '@/lib/utils';
import { Txt } from '../atoms';

type Props = {
  date: string;
  categoryData: CategoryData[];
};

export default function MainDashBoard({ date, categoryData }: Props) {
  const router = useRouter();
  const dDay = calculateDday(date);

  const isDone = (keyword: string) =>
    categoryData.some((c) => c.category.includes(keyword));

  return (
    <div
      className='flex w-full flex-col'
      onClick={() => {
        router.push('/wedding-bucket');
      }}
    >
      <div className='flex w-full flex-col'>
        <Txt size='text-[18px]' weight='font-[500]' className='mb-[20px]'>
          나의 결혼 준비
        </Txt>
      </div>
      <div className='bg-lightpurple border-linegray flex w-full justify-between rounded-[10px] border'>
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

          <div className='mt-[25px] mb-[34px] flex flex-col gap-[4px]'>
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
          className='mr-[25px] aspect-[118.25/118.25] shrink-0 rotate-[23.132deg]'
        />
      </div>
    </div>
  );
}
