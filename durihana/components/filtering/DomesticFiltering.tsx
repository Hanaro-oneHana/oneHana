'use client';

import { useEffect, useState } from 'react';
import Button from '../atoms/Button';
import HorizontalSlider from '../atoms/HorizontalSlider';

type Props = {
  onChange: (regions: string[]) => void;
};

export default function DomesticFiltering({ onChange }: Props) {
  const regions = [
    '서울',
    '경기도',
    '인천',
    '강원',
    '대전',
    '세종',
    '충북',
    '충남',
    '광주',
    '전북',
    '전남',
    '대구',
    '부산',
    '울산',
    '경북',
    '경남',
    '제주',
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
