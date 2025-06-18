import Txt from '../atoms/Txt';
import { Progress } from '../ui/progress';

type Props = {
  total: number;
  current: number;
};

export const lefts = [
  'left-[1%]',
  'left-[2%]',
  'left-[3%]',
  'left-[4%]',
  'left-[5%]',
  'left-[6%]',
  'left-[7%]',
  'left-[8%]',
  'left-[9%]',
  'left-[10%]',
  'left-[11%]',
  'left-[12%]',
  'left-[13%]',
  'left-[14%]',
  'left-[15%]',
  'left-[16%]',
  'left-[17%]',
  'left-[18%]',
  'left-[19%]',
  'left-[20%]',
  'left-[21%]',
  'left-[22%]',
  'left-[23%]',
  'left-[24%]',
  'left-[25%]',
  'left-[26%]',
  'left-[27%]',
  'left-[28%]',
  'left-[29%]',
  'left-[30%]',
  'left-[31%]',
  'left-[32%]',
  'left-[33%]',
  'left-[34%]',
  'left-[35%]',
  'left-[36%]',
  'left-[37%]',
  'left-[38%]',
  'left-[39%]',
  'left-[40%]',
  'left-[41%]',
  'left-[42%]',
  'left-[43%]',
  'left-[44%]',
  'left-[45%]',
  'left-[46%]',
  'left-[47%]',
  'left-[48%]',
  'left-[49%]',
  'left-[50%]',
  'left-[51%]',
  'left-[52%]',
  'left-[53%]',
  'left-[54%]',
  'left-[55%]',
  'left-[56%]',
  'left-[57%]',
  'left-[58%]',
  'left-[59%]',
  'left-[60%]',
  'left-[61%]',
  'left-[62%]',
  'left-[63%]',
  'left-[64%]',
  'left-[65%]',
  'left-[66%]',
  'left-[67%]',
  'left-[68%]',
  'left-[69%]',
  'left-[70%]',
  'left-[71%]',
  'left-[72%]',
  'left-[73%]',
  'left-[74%]',
  'left-[75%]',
  'left-[76%]',
  'left-[77%]',
  'left-[78%]',
  'left-[79%]',
  'left-[80%]',
  'left-[81%]',
  'left-[82%]',
  'left-[83%]',
  'left-[84%]',
  'left-[85%]',
  'left-[86%]',
  'left-[87%]',
  'left-[88%]',
  'left-[89%]',
  'left-[90%]',
  'left-[91%]',
  'left-[92%]',
  'left-[93%]',
  'left-[94%]',
  'left-[95%]',
  'left-[96%]',
  'left-[97%]',
  'left-[98%]',
  'left-[99%]',
  'left-[100%]',
];

export default function ProgressBar({ total, current }: Props) {
  const rawRatio = total === 0 ? 0 : (current / total) * 100;
  const ratio = Math.round(Math.min(rawRatio, 100));

  const isOver = rawRatio >= 100;

  return (
    <div className='w-full flex flex-col'>
      {/* 설명 텍스트 */}
      <Txt size='text-[15px]' className='mb-[10px]'>
        {isOver ? `예산 초과` : `웨딩 버켓 기준, ${ratio}% 사용`}
      </Txt>

      {/* 프로그레스바 + 숫자 레이어 */}
      <div className='relative w-full'>
        <Progress
          value={ratio}
          className={`
        h-[9px]
        w-full
        rounded-[20px]
        bg-[#E7E9EE]
        [&>div]:rounded-[20px]
        ${isOver ? '[&>div]:bg-red' : '[&>div]:bg-primarycolor'}`}
        />

        {/* 금액 텍스트 */}
        {isOver ? (
          <Txt
            size='text-[10px]'
            color='text-textgray'
            className={`absolute top-[-20px] right-0 whitespace-nowrap`}
          >
            {formatKRWUnit(current)}
          </Txt>
        ) : (
          <>
            <Txt
              size='text-[10px]'
              color='text-textgray'
              className={`absolute bottom-[-20px] whitespace-nowrap
                  ${
                    ratio < 15
                      ? 'left-0 translate-x-0'
                      : `left-[${ratio}%] translate-x-[-105%]`
                  }
                `}
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

export function formatKRWUnit(amount: number) {
  if (amount < 10000) {
    return `${Math.floor(amount)}원`;
  }
  if (amount < 10000000) {
    return `${Math.floor(amount / 10000)}만원`;
  }

  const parts: string[] = [];

  const 억 = Math.floor(amount / 100000000);
  const 천 = Math.floor((amount % 100000000) / 10000000);
  const 백 = Math.floor((amount % 10000000) / 1000000);
  const 만 = Math.floor((amount % 1000000) / 10000);

  if (억 > 0) parts.push(`${억}억`);
  if (천 > 0) parts.push(`${천}천`);
  if (백 > 0) parts.push(`${백}백`);
  if (억 === 0 && 천 === 0 && 백 === 0 && 만 > 0) parts.push(`${만}`);

  const lastIndex = parts.length - 1;

  if (!(parts.length === 1 && parts[0].includes('억'))) {
    parts[lastIndex] += '만원';
  }

  return parts.join(' ');
}
