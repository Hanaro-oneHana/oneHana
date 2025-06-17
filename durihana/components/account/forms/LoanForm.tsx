'use client';

import Txt from '@/components/atoms/Txt';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ExpandingInput from './ExpandingInput';

type LoanFormProps = {
  amount: string;
  period: number;
  userAccount: string;
  onAmountChange: (value: string) => void;
  onPeriodChange: (period: number) => void;
  onTransferDayChange: (day: number) => void;
  // 새로 추가된 props
  monthlyPayment?: string;
  transferDay?: number;
  onMonthlyPaymentChange?: (value: string) => void;
};

export default function LoanForm({
  amount,
  period,
  userAccount,
  onAmountChange,
  onPeriodChange,
  onTransferDayChange,
  monthlyPayment = '',
  transferDay = 15,
  onMonthlyPaymentChange,
}: LoanFormProps) {
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // 대출 금액에 따른 예상 월 상환액 계산 (간단한 예시)
  const calculateMonthlyPayment = (loanAmount: string, months: number) => {
    const principal = Number.parseInt(loanAmount.replace(/,/g, '')) || 0;
    if (principal === 0) return '0';

    // 연 5% 이자율 가정 (실제로는 더 복잡한 계산)
    const monthlyRate = 0.05 / 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(monthlyPayment).toLocaleString();
  };

  const estimatedPayment = calculateMonthlyPayment(amount, period);
  return (
    <div className='flex-1 px-6 py-8'>
      <Txt size='text-[22px]' className='block text-mainblack mb-[40px]'>
        두리아나대출통장
      </Txt>

      <div className='space-y-6'>
        {/* 대출 금액/기간 선택 */}
        <div>
          <Txt size='text-[16px]' className='block text-mainblack mb-[20px]'>
            얼마를 대출받을까요?
          </Txt>
          <div className='flex items-end gap-2 mb-[40px]'>
            <ExpandingInput
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder='최소 100만원'
              className=' text-[14px] font-[400] leading-[24px] text-icongray border-b-[0.5px] border-mainblack bg-transparent px-0 pb-0'
            />
            <Txt size='text-[12px]' className='text-mainblack'>
              을
            </Txt>

            <DropdownMenu open={isPeriodOpen} onOpenChange={setIsPeriodOpen}>
              <DropdownMenuTrigger className='min-w-[60px] flex items-center gap-1 text-[14px] font-[400] text-primarycolor leading-[24px] bg-transparent border-b-[0.5px] border-mainblack outline-none py-1'>
                {period}개월
                <ChevronDown
                  className={`h-4 w-4 transition-transform text-mainblack duration-200 ${
                    isPeriodOpen ? 'rotate-180' : ''
                  }`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[90px]' align='start'>
                <DropdownMenuItem
                  onSelect={() => {
                    onPeriodChange(12);
                    setIsPeriodOpen(false);
                  }}
                >
                  12개월
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    onPeriodChange(24);
                    setIsPeriodOpen(false);
                  }}
                >
                  24개월
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Txt size='text-[12px]' className='text-mainblack'>
              만기로 대출
            </Txt>
          </div>
        </div>

        {/* 월 상환액 입력 */}
        <div>
          <Txt size='text-[16px]' className='block text-mainblack mb-[20px]'>
            매월 얼마씩 상환할까요?
          </Txt>
          <div className='flex items-end gap-2 mb-[20px]'>
            <ExpandingInput
              value={monthlyPayment}
              onChange={(e) => onMonthlyPaymentChange?.(e.target.value)}
              placeholder={`예상 ${estimatedPayment}원`}
              className='text-[14px] font-[400] leading-[24px] text-icongray border-b-[0.5px] border-mainblack bg-transparent px-0 pb-0'
            />
            <Txt size='text-[12px]' className='text-mainblack'>
              씩 상환
            </Txt>
          </div>
          <Txt size='text-[12px]' className='text-gray-500 mb-[40px]'>
            * 예상 월 상환액: {estimatedPayment}원 (원금 + 이자 포함)
          </Txt>
        </div>

        {/* 상환일 선택 */}
        <div>
          <Txt size='text-[16px]' className='block text-mainblack mb-[20px]'>
            언제 상환할까요?
          </Txt>
          <div className='flex items-end gap-2 mb-[42px]'>
            <Txt size='text-[12px]' className='text-mainblack'>
              매월
            </Txt>

            <DropdownMenu
              open={isTransferOpen}
              onOpenChange={setIsTransferOpen}
            >
              <DropdownMenuTrigger className='min-w-[40px] flex items-center gap-1 text-[14px] font-[400] leading-[24px] text-primarycolor bg-transparent border-b-[0.5px] border-mainblack outline-none pb-1'>
                {transferDay}일
                <ChevronDown
                  className={`h-4 w-4 transition-transform text-mainblack duration-200 ${
                    isTransferOpen ? 'rotate-180' : ''
                  }`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[90px]' align='start'>
                {[1, 15, 20, 25].map((d) => (
                  <DropdownMenuItem
                    key={d}
                    onSelect={() => {
                      onTransferDayChange(d);
                      setIsTransferOpen(false);
                    }}
                  >
                    매월 {d}일
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Txt size='text-[12px]' className='text-mainblack'>
              에 자동 출금
            </Txt>
          </div>
        </div>

        <div>
          <Txt size='text-[16px]' className='block text-mainblack mb-[20px]'>
            만기 시
          </Txt>
          <div className='flex items-baseline gap-2 mb-[43px]'>
            <Txt size='text-[14px]' className='text-primarycolor'>
              자동 해지
            </Txt>
            <Txt size='text-[12px]' className='text-mainblack'>
              하며
            </Txt>
            <Txt size='text-[14px]' className='text-primarycolor'>
              카카오 알림톡
            </Txt>
            <Txt size='text-[12px]' className='text-mainblack'>
              으로 알려드립니다
            </Txt>
          </div>
        </div>

        <div>
          <Txt size='text-[16px]' className='block text-mainblack'>
            아래 계좌로 입금됩니다
          </Txt>
          <div className='space-y-1'>
            <Txt size='text-[12px]' className='text-primarycolor'>
              두리아나입출금통장
            </Txt>
            <Txt size='text-[14px]' className='text-primarycolor'>
              {userAccount}
            </Txt>
          </div>
        </div>
      </div>
    </div>
  );
}
