'use client';

import { Txt } from '@/components/atoms';
import { useEffect, useState } from 'react';
import { getAllInterestRates } from '@/lib/actions/InterestActions';

type InterestInfo = { label: string; rates: string[] };

export default function RatesTable() {
  const [interestInfo, setInterestInfo] = useState<InterestInfo[]>([]);
  const steps = ['기본', 'step 1', 'step 2', 'step 3', 'step 4', 'step 5'];

  useEffect(() => {
    getAllInterestRates().then((data) => setInterestInfo(data));
  }, []);

  if (interestInfo.length === 0) return <p>Loading…</p>;

  return (
    <div className='overflow-x-auto px-2 pb-4'>
      <table className='w-full table-fixed border-collapse text-center'>
        <thead>
          <tr className='border-linegray border-b'>
            <th className='p-2'>
              <Txt>구분</Txt>
            </th>
            {interestInfo.map(({ label }) => (
              <th key={label} className='p-2'>
                <Txt className=''>{label}</Txt>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {steps.map((step, rowIdx) => (
            <tr
              key={step}
              className={[
                'border-linegray border-b',
                rowIdx === steps.length - 1 && 'last:border-b-0',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* 1) 왼쪽 ‘구분’ 열 */}
              <td className='p-2'>
                <Txt size='text-[14px]'>{step}</Txt>
              </td>

              {/* 2) 각 금리 열 */}
              {interestInfo.map(({ rates, label }) => (
                <td key={`${label}-${rowIdx}`} className='p-2'>
                  <Txt size='text-[14px]'>{rates[rowIdx]}</Txt>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
