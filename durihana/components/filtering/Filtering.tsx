'use client';

import { Button, HorizontalSlider } from '@/components/atoms';
import { useEffect } from 'react';

type Props = {
  regions?: string[];
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
};

export default function Filtering({
  regions,
  selectedRegions,
  setSelectedRegions,
}: Props) {
  useEffect(() => {
    if (setSelectedRegions) {
      setSelectedRegions(selectedRegions || []);
    }
  }, [selectedRegions, setSelectedRegions]);

  const toggleRegion = (region: string) => {
    if (setSelectedRegions) {
      setSelectedRegions(
        selectedRegions.includes(region)
          ? selectedRegions.filter((r) => r !== region)
          : [...selectedRegions, region]
      );
    }
  };

  return (
    <>
      <HorizontalSlider>
        <div className='flex gap-[7px] px-[20px]'>
          {regions &&
            regions.map((region) => (
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
