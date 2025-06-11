import { Progress } from '../ui/progress';

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
