'use client';

import { useEffect, useState } from 'react';
import Button from '../atoms/Button';
import HorizontalSlider from '../atoms/HorizontalSlider';

type Props = {
  onChange: (regions: string[]) => void;
};

export default function ForeignFiltering({ onChange }: Props) {
  const regions = [
    '추천 여행지',
    '국내',
    '아시아',
    '유럽',
    '미주',
    '오세아니아',
    '기타',
  ];

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  useEffect(() => {
    onChange(selectedRegions);
  }, [selectedRegions, onChange]);

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };
  return (
    <>
      <HorizontalSlider>
        <div className='flex gap-[7px]'>
          {regions.map((region) => (
            <Button
              key={region}
              onClick={() => toggleRegion(region)}
              className={`rounded-10px px-[12px] py-[7px] text-[12px] whitespace-nowrap
                      transition-colors duration-200
                      ${
                        selectedRegions.includes(region)
                          ? 'bg-primaryhalf text-mainblack'
                          : 'bg-buttonlightgray text-mainblack'
                      }
                    `}
            >
              {region}
            </Button>
          ))}
        </div>
      </HorizontalSlider>
    </>
  );
}
