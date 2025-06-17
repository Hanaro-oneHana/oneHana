'use client';

import InputComponent from '@/components/atoms/InputComponent';
import Txt from '@/components/atoms/Txt';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type DepositFormProps = {
  amount: string;
  period: number;
  userAccount: string;
  onAmountChange: (value: string) => void;
  onPeriodChange: (period: number) => void;
};

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
      <Txt size='text-[22px]' className='block text-mainblack mb-[40px]'>
        두리하나예금통장
      </Txt>

      <div className='space-y-6'>
        <div>
          <Txt size='text-[16px]' className='block text-mainblack mb-[20px]'>
            얼마를 저축할까요?
          </Txt>
          <div className='flex items-end gap-2 mb-[42px]'>
            <InputComponent
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder='최소 100만원'
              className='w-20 text-[14px] font-[400] text-icongray leading-[24px] border-b-[0.5px] border-mainblack bg-transparent px-0 pb-0'
            />

            <Txt size='text-[12px]' className='text-mainblack'>
              을
            </Txt>

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger
                className={`
                  min-w-[60px]
                  flex items-center gap-1
                  text-[14px] font-[400]
                  leading-[24px]
                  text-primarycolor
                  bg-transparent
                  border-b-[0.5px] border-mainblack
                  outline-none pb-1
                `}
              >
                {period}개월
                <ChevronDown
                  className={`
                    h-4 w-4 transition-transform text-mainblack duration-200
                    ${isOpen ? 'rotate-180' : ''}
                  `}
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
          <Txt size='text-[16px]' className='block text-mainblack mb-[10px]'>
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
