import { calculateDday } from '@/lib/utils';
import { Txt } from '../atoms';

type Props = {
  date: string;
  category: { id: number; type: string }[];
};

export default function MainDashBoard({ date, category }: Props) {
  const dDay = calculateDday(date);
  console.log('🚀 ~ MainDashBoard ~ dDay:', dDay);

  return (
    <>
      <div className='flex flex-col w-full'>
        <Txt>나의 결혼 준비</Txt>
      </div>
      <div className='w-full bg-lightpurple rounded-[10px]'>
        <Txt>{`D-${dDay}`}</Txt>
      </div>
    </>
  );
}
