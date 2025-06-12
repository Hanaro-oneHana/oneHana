import { Progress } from '../ui/progress';
import Txt from './Txt';

type Props = {
  total: number;
  current: number;
};

export default function ProgressBar({ total, current }: Props) {
  const rawRatio = total === 0 ? 0 : (current / total) * 100;
  const ratio = Math.min(rawRatio, 100);

  const isOver = rawRatio > 100;

  return (
    <div>
      <Txt>{isOver ? `예산 초과` : `예산의 ${ratio}% 사용`}</Txt>
      <Progress
        value={ratio}
        className={`
        h-[9px]
        w-full max-w-[335px]
        rounded-[20px]
        bg-[#E7E9EE]
        backdrop-blur-sm
        [&>div]:rounded-[20px]
        ${isOver ? '[&>div]:bg-[#DC231E]' : '[&>div]:bg-primarycolor'}
      `}
      />
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
