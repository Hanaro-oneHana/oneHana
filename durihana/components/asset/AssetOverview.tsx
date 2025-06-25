'use client';

import { AssetLog, ProgressBar } from '@/components/asset';
import dynamic from 'next/dynamic';

type Props = {
  data: { name: string; value: number }[];
  balance: number;
};
export default function AssetOverview({ data, balance }: Props) {
  const AssetPieChart = dynamic(() => import('./AssetChart'), {
    ssr: false,
  });

  const assetData = data;
  const usedBudget = data.reduce((sum, item) => sum + item.value, 0);
  const totalBudget = balance;

  return (
    <>
      <div className='flex w-full flex-col items-center gap-y-[40px] pb-[40px]'>
        <AssetLog data={assetData} />
        <div className='w-full px-[20px]'>
          <AssetPieChart data={assetData} />
        </div>
        <ProgressBar current={usedBudget} total={totalBudget} />
      </div>
    </>
  );
}
