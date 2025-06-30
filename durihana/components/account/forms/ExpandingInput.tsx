import InputComponent from '@/components/atoms/InputComponent';
import { ExpandingInputProps } from '@/types/Account';

export default function ExpandingInput({
  value,
  onChange,
  placeholder,
  className,
  readOnly,
}: ExpandingInputProps) {
  // placeholder vs. value 중 긴 쪽 길이를 ch 단위로
  const chCount = Math.max(value.length, placeholder.length) + 4;

  return (
    <InputComponent
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: `${chCount}ch` }}
      className={className}
    />
  );
}
