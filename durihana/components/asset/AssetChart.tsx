'use client';

import { PieChart, Pie, Cell } from 'recharts';
import Txt from '../atoms/Txt';

type Props = {
  data: { name: string; value: number }[];
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
  return (
    <div className='flex items-center gap-[56.26px]'>
      <div className='flex items-center justify-center w-[170px] h-[170px]'>
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

      <div className='flex flex-col justify-center'>
        {data.map((entry, index) => (
          <div key={index} className='flex items-center mb-[11px] last:mb-0 '>
            <div
              className='w-[11px] h-[10px] mr-[22px]'
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <Txt>{entry.name}</Txt>
          </div>
        ))}
      </div>
    </div>
  );
}
