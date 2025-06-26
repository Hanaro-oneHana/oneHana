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
  const lastSearchedRef = useRef<string | null>(null);

  useEffect(() => {
    const trimmed = debouncedValue.trim();

    if (trimmed === lastSearchedRef.current) return;

    lastSearchedRef.current = trimmed;
    onSearch(trimmed);
  }, [debouncedValue, onSearch]);

  return (
    <div
      className={`border-primarycolor bg-mainwhite flex w-full gap-2 rounded-[9px] border-2 p-2`}
    >
      <Image src='/asset/icons/search.svg' alt='검색' width={24} height={24} />
      <Input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className='text-mainblack w-full text-sm focus:outline-none'
      />
    </div>
  );
}
