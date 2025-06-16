'use client';

import Image from 'next/image';
import { PropsWithChildren, useState } from 'react';
import { cn } from '@/lib/utils';
import Txt from './atoms/Txt';

type Props = {
  selectedItem: number;
  progress: boolean;
  onClick?: () => void;
};

export default function ProgressBarButton({
  selectedItem,
  progress,
  onClick,
}: Props) {
  const items = [
    { id: 1, name: '예식장', icon: '/asset/icons/flower.svg' },
    { id: 2, name: '스드메', icon: '/asset/icons/dress.svg' },
    { id: 3, name: '신혼여행', icon: '/asset/icons/flight.svg' },
    { id: 4, name: '가전·가구', icon: '/asset/icons/tv.svg' },
    { id: 5, name: '예물·예단', icon: '/asset/icons/ring.svg' },
  ];

  const [selected, setSelected] = useState(selectedItem);

  return (
    <div className='flex items-center justify-center w-full  gap-[8px]'>
      {items.map((item) => (
        <div
          key={item.id}
          className='flex items-start justify-center gap-[8px]'
        >
          <div className='flex flex-col items-center gap-[10px]'>
            <ButtonBox
              selected={item.id === selected}
              onClick={() => {
                setSelected(item.id);
                if (onClick) {
                  onClick();
                }
              }}
              disabled={progress}
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
                'flex items-center justify-center gap-[2px] mt-[20px]',
                !progress && 'invisible'
              )}
            >
              <div className='w-1 h-1  bg-linegray rounded-full' />
              <div className='w-1 h-1 bg-linegray rounded-full' />
              <div className='w-1 h-1 bg-linegray rounded-full' />
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
        `flex items-center justify-center p-[3px] rounded-[10px] w-fit h-fit`,
        selected
          ? 'bg-skyblue shadow-[2px_2px_4px_0px_rgba(135,135,135,0.10)] '
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
