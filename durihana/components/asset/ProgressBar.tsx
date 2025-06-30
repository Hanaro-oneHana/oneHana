import { Txt } from '@/components/atoms';
import { Progress } from '@/components/ui/progress';
import { formatKRWUnit } from '@/lib/utils';

type Props = {
  total: number;
  current: number;
};

export default function ProgressBar({ total, current }: Props) {
  const rawRatio = total === 0 ? 0 : (current / total) * 100;
  const ratio = Math.round(Math.min(rawRatio, 100));

  const isOver = rawRatio > 100;

  return (
    <div className='flex w-full flex-col'>
      {/* 설명 텍스트 */}
      <Txt size='text-[15px]' className='mb-[10px]'>
        {isOver ? `예산 초과` : `웨딩 버켓 기준, ${ratio}% 사용`}
      </Txt>

      {/* 프로그레스바 + 숫자 레이어 */}
      <div className='relative w-full'>
        <Progress
          value={ratio}
          className={`h-[9px] w-full rounded-[20px] bg-[#E7E9EE] [&>div]:rounded-[20px] ${isOver ? '[&>div]:bg-red' : '[&>div]:bg-primarycolor'}`}
        />

        {/* 금액 텍스트 */}
        {isOver || rawRatio === 100 ? (
          <Txt
            size='text-[10px]'
            color='text-textgray'
            className={`absolute right-0 bottom-[-20px] whitespace-nowrap`}
          >
            {formatKRWUnit(current)}
          </Txt>
        ) : (
          <>
            <Txt
              size='text-[10px]'
              color='text-textgray'
              className={`absolute bottom-[-20px] whitespace-nowrap ${
                ratio < 15
                  ? 'left-0 translate-x-0'
                  : `left-[${ratio}%] translate-x-[-105%]`
              } `}
            >
              {formatKRWUnit(current)}
            </Txt>

            <Txt
              size='text-[10px]'
              color='text-textgray'
              className={`absolute top-[-20px] right-0 whitespace-nowrap`}
            >
              {formatKRWUnit(total)}
            </Txt>
          </>
        )}
      </div>
    </div>
  );
}
