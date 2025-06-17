import InputComponent from '@/components/atoms/InputComponent';
import React, { ChangeEvent } from 'react';

interface ExpandingInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

export default function ExpandingInput({
  value,
  onChange,
  placeholder,
  className,
}: ExpandingInputProps) {
  // placeholder vs. value 중 긴 쪽 길이를 ch 단위로
  const chCount = Math.max(value.length, placeholder.length) + 2;

  return (
    <InputComponent
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: `${chCount}ch` }}
      className={className}
    />
  );
}
