'use client';

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { FormEvent, useRef } from 'react';

type Props = {
  onSearch: (query: string) => void;
  placeholder?: string;
};
export default function Search({
  onSearch,
  placeholder = '제휴처 검색',
}: Props) {
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchRef.current?.value.trim() ?? '');
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`
        flex gap-2 w-full border-2 border-primarycolor
        rounded-[9px] bg-mainwhite p-2 
      `}
      >
        <Image
          src='/asset/icons/search.svg'
          alt='검색'
          width={24}
          height={24}
        />
        <Input
          type='text'
          ref={searchRef}
          placeholder={placeholder}
          className='focus:outline-none w-full'
        />
      </form>
    </>
  );
}
