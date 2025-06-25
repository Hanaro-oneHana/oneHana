'use client';

import Txt from '@/components/atoms/Txt';
import { categories } from '@/constants/store';
import Image from 'next/image';
import { PropsWithChildren, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  selectedItem: number;
  setSelectedItem: (id: number) => void;
  progress: boolean;
  onClick?: () => void;
};

export default function ProgressBarButton({
  selectedItem,
  setSelectedItem,
  progress,
  onClick,
}: Props) {
  useEffect(() => {
    setSelectedItem(selectedItem);
  }, [selectedItem, setSelectedItem]);

  return (
    <div className='flex w-full items-center justify-center gap-[8px]'>
      {categories.map((item) => (
        <div
          key={item.id}
          className='flex items-start justify-center gap-[8px]'
        >
          <div className='flex flex-col items-center gap-[10px]'>
            <ButtonBox
              selected={item.id === selectedItem}
              onClick={() => {
                setSelectedItem(item.id);
                if (onClick) {
                  onClick();
                }
              }}
            >
              <Image
                src={item.icon}
                alt={`${item.name} Icon`}
                width={35}
                height={35}
              />
            </ButtonBox>
            <Txt size='text-[10px]' weight='font-[500]'>
              {item.name}
            </Txt>
          </div>

          {item.id !== 5 && (
            <div
              className={cn(
                'mt-[20px] flex items-center justify-center gap-[2px]',
                !progress && 'invisible'
              )}
            >
              <div className='bg-linegray h-1 w-1 rounded-full' />
              <div className='bg-linegray h-1 w-1 rounded-full' />
              <div className='bg-linegray h-1 w-1 rounded-full' />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const ButtonBox = ({
  children,
  selected,
  disabled = false,
  onClick,
}: PropsWithChildren<{
  selected: boolean;
  onClick?: () => void;
  disabled?: boolean;
}>) => {
  return (
    <button
      className={cn(
        `flex h-fit w-fit items-center justify-center rounded-[10px] p-[3px]`,
        selected
          ? 'bg-skyblue shadow-[2px_2px_4px_0px_rgba(135,135,135,0.10)]'
          : 'bg-linegray opacity-60',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
