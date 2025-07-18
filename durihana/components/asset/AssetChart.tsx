'use client';

import { CategoryData } from '@/types/Asset';
import { PieChart, Pie, Cell } from 'recharts';
import Image from 'next/image';
import Txt from '../atoms/Txt';

type Props = {
  data: CategoryData[];
};

type PieLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
};

const COLORS = [
  'var(--primarycolor)',
  'var(--secondarycolor)',
  'var(--icon)',
  'var(--purple)',
  'var(--lime)',
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.72;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor='middle'
      dominantBaseline='central'
      fontSize={10}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AssetChart({ data }: Props) {
  const isEmpty = data.length === 0;

  return (
    <>
      {isEmpty ? (
        <div className='flex w-full flex-col items-center'>
          <Txt
            size='text-[14px]'
            color='text-textgray'
            className='mb-[20px] text-center'
          >
            예약 및 결제 완료된 항목을 기준으로
            <br /> 지출 데이터가 시각적으로 분석되어 표시됩니다.
          </Txt>

          <Image
            src='/asset/images/piechart.svg'
            alt='파이차트'
            width={302}
            height={170}
            className='blur-[4px]'
          />
        </div>
      ) : (
        <>
          <div className='flex w-full items-center'>
            {/* 파이 차트 */}
            <div className='flex h-[170px] w-[170px] shrink-0 items-center justify-center'>
              <PieChart width={170} height={170}>
                <Pie
                  data={data}
                  cx={80}
                  cy={80}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  dataKey='value'
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>

            {/* 항목 설명 영역 */}
            <div className='ml-auto flex flex-col justify-center'>
              {data.map((entry, index) => (
                <div
                  key={index}
                  className='mb-[11px] flex items-center last:mb-0'
                >
                  <div
                    className='mr-[22px] h-[10px] w-[11px]'
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                  <Txt>{entry.category}</Txt>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
