'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onSearch: (query: string) => void;
  placeholder?: string;
};
export default function Search({
  onSearch,
  placeholder = '제휴처 검색',
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 200);

  const lastSearchedRef = useRef('');

  useEffect(() => {
    const trimmed = debouncedValue.trim();
    onSearch(trimmed);
  }, [debouncedValue]);

  return (
    <div
      className={`
        flex gap-2 w-full border-2 border-primarycolor
        rounded-[9px] bg-mainwhite p-2 
      `}
    >
      <Image src='/asset/icons/search.svg' alt='검색' width={24} height={24} />
      <Input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className='focus:outline-none w-full text-sm text-mainblack'
      />
    </div>
  );
}
