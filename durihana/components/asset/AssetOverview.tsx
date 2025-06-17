'use client';

import dynamic from 'next/dynamic';
import AssetLog from './AssetLog';
import ProgressBar from './ProgressBar';

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
      <div className='flex flex-col items-center gap-y-[40px] pt-[40px] pb-[40px]'>
        <AssetLog data={assetData} />
        <AssetPieChart data={assetData} />
        <ProgressBar current={usedBudget} total={totalBudget} />
      </div>
    </>
  );
}
