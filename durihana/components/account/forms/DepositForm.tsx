'use client';

import Txt from '@/components/atoms/Txt';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DepositFormProps } from '@/types/Account';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ExpandingInput from './ExpandingInput';

export default function DepositForm({
  amount,
  period,
  userAccount,
  onAmountChange,
  onPeriodChange,
}: DepositFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex-1 px-6 py-8'>
      <Txt size='text-[22px]' className='text-mainblack mb-[40px] block'>
        두리하나예금통장
      </Txt>

      <div className='space-y-6'>
        <div>
          <Txt size='text-[16px]' className='text-mainblack mb-[20px] block'>
            얼마를 저축할까요?
          </Txt>
          <div className='mb-[42px] flex items-end gap-2'>
            <ExpandingInput
              value={
                amount ? Number(amount.replace(/,/g, '')).toLocaleString() : ''
              }
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder='최소 100만원'
              className='text-icongray border-mainblack border-b-[0.5px] bg-transparent px-0 pb-0 text-[14px] leading-[24px] font-[400]'
            />

            <Txt size='text-[12px]' className='text-mainblack'>
              을
            </Txt>

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger
                className={`text-primarycolor border-mainblack flex min-w-[60px] items-center gap-1 border-b-[0.5px] bg-transparent pb-1 text-[14px] leading-[24px] font-[400] outline-none`}
              >
                {period}개월
                <ChevronDown
                  className={`text-mainblack h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} `}
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent className='w-[90px]' align='start'>
                <DropdownMenuItem onSelect={() => onPeriodChange(12)}>
                  12개월
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onPeriodChange(24)}>
                  24개월
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Txt size='text-[12px]' className='text-mainblack'>
              만기로 저축
            </Txt>
          </div>
        </div>

        <div>
          <Txt size='text-[16px]' className='text-mainblack mb-[10px] block'>
            아래 계좌에서 출금됩니다
          </Txt>
          <div className='space-y-1'>
            <Txt size='text-[12px]' className='text-primarycolor'>
              두리하나입출금통장
            </Txt>
          </div>
          <div>
            <Txt size='text-[14px]' className='text-primarycolor'>
              {userAccount}
            </Txt>
          </div>
        </div>
      </div>
    </div>
  );
}
