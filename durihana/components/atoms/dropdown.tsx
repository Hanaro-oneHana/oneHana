'use client';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React, { useReducer, useState, useRef, useEffect, Fragment, PropsWithChildren,} from 'react';
import Button from './Button';
import { Color } from '@/app/theme';
import { cn } from "@/lib/utils"

type Props = {
  items?: string[];
  defaultTitle?: string;

  className?: string;
  width?: `w-[${number}px]`;
  height?: `h-[${number}px]`;
  bgColor?: 'bg-mainwhite' | 'bg-primarycolor' | 'bg-transparent';
  borderStyle?: 'border-none' | `border-${Color}`;
  underlineBorder?: 'border-none' | `border-${Color}`;

  textSize?: `text-[${number}px]`;
  textColor?: `text-${Color}`;

  onSelect?: (list:string) => void;
};

export default function Dropdown({
  items = ['select1', 'select2', 'select3'],
  defaultTitle = 'option',

  width = 'w-[80px]',
  height = 'h-[40px]',
  bgColor = 'bg-primarycolor',
  textColor = 'text-mainblack',
  
  borderStyle = 'border-none',
  underlineBorder = 'border-none',

  onSelect,
  children,
}: PropsWithChildren<Props>) {
  const [isOpen, toggleOpen] = useReducer((prev) => !prev, false);
  const [selected, setSelected] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        isOpen
      )
        toggleOpen();
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const content = selected ?? defaultTitle;

  return <>
      <div className='relative inline-block' ref={dropdownRef}>
        <Button
          onClick={toggleOpen}
          className={`${width} ${height} ${bgColor} ${textColor} ${borderStyle} px-4 flex items-center justify-between 
            ${isOpen ? 'rounded-b-none' : ''}`}
        >
          <span className='truncate'>{content}</span>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>

        {isOpen && (
          <div
            className={`${width} ${bgColor} ${borderStyle} absolute right-0 mt-0 border border-gray-200 border-t-0 rounded-b-[10px] rounded-t-none shadow-lg max-h-[200px] overflow-auto z-10`}
          >
            <ul className='p-0 m-0 list-none'>
              {items.map((input, i) => (
                <Fragment key={input}>
                  <li
                    className='px-4 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer'
                    onClick={() => {
                      setSelected(input);
                      toggleOpen();
                      onSelect?.(input);
                    }}
                  >
                    <span>{input}</span>
                  </li>
                  {i < items.length - 1 && (
                    <hr className={`${underlineBorder}`} />
                  )}
                </Fragment>
              ))}
            </ul>
          </div>
        )}
        {children}
      </div>
    </>;
}
