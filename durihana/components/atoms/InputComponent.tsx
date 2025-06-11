'use client';

import { Input } from '@/components/ui/input';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import React from 'react';

//사용하는 곳에서 return <InputComponent label='name' text='이름' />
export type InputComponentProps = {
  //필드 구분
  label: 'name' | 'tel' | 'birth' | 'marry_date' | 'password';
  // placeholder 용
  text?: string;
  width?: string;
};

export default function InputComponent({
  label,
  text,
  width = 'w-375',
}: InputComponentProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');

    if (label === 'password') {
      //비번일 때는 숫자 6자리
      const numeric = raw.slice(0, 6);
      e.target.value = numeric;
    } else if (label === 'tel') {
      // 최대 11자리로 자르기 (010 + 4 + 4)
      const numeric = raw.slice(0, 11);
      const len = numeric.length;

      if (len <= 3) {
        // 0~3자리: 그대로
        e.target.value = numeric;
      } else if (len <= 7) {
        // 4~7자리: 010-1234
        e.target.value = `${numeric.slice(0, 3)}-${numeric.slice(3)}`;
      } else {
        // 8~11자리: 010-1234-5678
        e.target.value = `${numeric.slice(0, 3)}-${numeric.slice(3, 7)}-${numeric.slice(7)}`;
      }
    } else if (label === 'birth' || label === 'marry_date') {
      // 날짜: YYYY-MM-DD 형태
      const num = raw.slice(0, 8); // 최대 8자리 (YYYYMMDD)
      if (num.length <= 4) {
        // YYYY
        e.target.value = num;
      } else if (num.length <= 6) {
        // YYYY-MM
        e.target.value = `${num.slice(0, 4)}-${num.slice(4)}`;
      } else {
        // YYYY-MM-DD
        e.target.value = `${num.slice(0, 4)}-${num.slice(4, 6)}-${num.slice(6)}`;
      }
    }
  };

  let type: HTMLInputTypeAttribute;
  let pattern: string | undefined;
  let maxLength: number | undefined;

  switch (label) {
    case 'tel':
      type = 'tel';
      pattern = '\\d{3}-\\d{4}-\\d{4}';
      break;
    case 'birth':
    case 'marry_date':
      type = 'text';
      pattern = '\\d{4}-\\d{2}-\\d{2}';
      maxLength = 10;
      break;
    case 'password':
      type = 'password';
      pattern = '\\d{6}';
      maxLength = 6;
      break;
    default:
      type = 'text';
  }

  return (
    <Input
      type={type}
      placeholder={text}
      pattern={pattern}
      maxLength={maxLength}
      className={`h-10 ${width} bg-transparent focus:outline-none border-b placeholder-[#666666] `}
      onChange={handleChange}
    />
  );
}
