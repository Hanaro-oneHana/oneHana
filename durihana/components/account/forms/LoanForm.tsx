'use client';

import Txt from '@/components/atoms/Txt';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { LoanFormProps } from '@/types/Account';
import { ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getLoanInterestRate } from '@/lib/actions/InterestActions';
import ExpandingInput from './ExpandingInput';

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
  const { data: session } = useSession();
  const userId = Number(session?.user?.id);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [annualRate, setAnnualRate] = useState<number>(0);
  useEffect(() => {
    if (!userId) return;
    getLoanInterestRate(userId).then((rate) => {
      setAnnualRate(rate);
    });
  }, [userId]);

  const monthlyRate = annualRate / 100 / 12;

  const calculateMonthlyPayment = (
    loanAmount: string,
    months: number,
    rate = monthlyRate
  ) => {
    const principal = parseInt(loanAmount.replace(/,/g, ''), 10) || 0;
    if (!principal || !rate) return '0';

    const payment =
      (principal * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);

    return Math.round(payment).toLocaleString();
  };

  const estimatedPayment = calculateMonthlyPayment(amount, period);
  return (
    <div className='scrollbar-hide flex flex-1 flex-col overflow-y-auto px-6 py-8'>
      <Txt size='text-[22px]' className='text-mainblack mb-[40px] block'>
        두리하나대출통장
      </Txt>

      <div className='space-y-6'>
        {/* 대출 금액/기간 선택 */}
        <div>
          <Txt size='text-[16px]' className='text-mainblack mb-[20px] block'>
            얼마를 대출받을까요?
          </Txt>
          <div className='mb-[40px] flex items-end gap-2'>
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

            <DropdownMenu open={isPeriodOpen} onOpenChange={setIsPeriodOpen}>
              <DropdownMenuTrigger className='text-primarycolor border-mainblack flex min-w-[60px] items-center gap-1 border-b-[0.5px] bg-transparent py-1 text-[14px] leading-[24px] font-[400] outline-none'>
                {period}개월
                <ChevronDown
                  className={`text-mainblack h-4 w-4 transition-transform duration-200 ${
                    isPeriodOpen ? 'rotate-180' : ''
                  }`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[90px]' align='start'>
                {[12, 24].map((m) => (
                  <DropdownMenuItem
                    key={m}
                    onSelect={() => {
                      onPeriodChange(m);
                      setIsPeriodOpen(false);
                    }}
                  >
                    {m}개월
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Txt size='text-[12px]' className='text-mainblack'>
              만기로 대출
            </Txt>
          </div>
        </div>

        {/* 월 상환액 입력 */}
        <div>
          <Txt size='text-[16px]' className='text-mainblack mb-[20px] block'>
            매월 얼마씩 상환할까요?
          </Txt>
          <div className='mb-[20px] flex items-end gap-2'>
            <ExpandingInput
              value={monthlyPayment}
              readOnly={true}
              onChange={(e) => onMonthlyPaymentChange?.(e.target.value)}
              placeholder={`예상 ${estimatedPayment}원`}
              className='text-icongray border-mainblack border-b-[0.5px] bg-transparent px-0 pb-0 text-[14px] leading-[24px] font-[400]'
            />
            <Txt size='text-[12px]' className='text-mainblack'>
              씩 상환
            </Txt>
          </div>
          <Txt size='text-[12px]' className='mb-[40px] text-gray-500'>
            * 예상 월 상환액: {estimatedPayment}원 (원금 + 이자 포함)
          </Txt>
        </div>

        {/* 상환일 선택 */}
        <div>
          <Txt size='text-[16px]' className='text-mainblack mb-[20px] block'>
            언제 상환할까요?
          </Txt>
          <div className='mb-[42px] flex items-end gap-2'>
            <Txt size='text-[12px]' className='text-mainblack'>
              매월
            </Txt>

            <DropdownMenu
              open={isTransferOpen}
              onOpenChange={setIsTransferOpen}
            >
              <DropdownMenuTrigger className='text-primarycolor border-mainblack flex min-w-[40px] items-center gap-1 border-b-[0.5px] bg-transparent pb-1 text-[14px] leading-[24px] font-[400] outline-none'>
                {transferDay}일
                <ChevronDown
                  className={`text-mainblack h-4 w-4 transition-transform duration-200 ${
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
          <Txt size='text-[16px]' className='text-mainblack mb-[20px] block'>
            만기 시
          </Txt>
          <div className='mb-[43px] flex items-baseline gap-2'>
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
          <Txt size='text-[16px]' className='text-mainblack block'>
            아래 계좌로 입금됩니다
          </Txt>
          <div className='space-y-1'>
            <Txt size='text-[12px]' className='text-primarycolor'>
              두리하나입출금통장
            </Txt>
            <Txt
              size='text-[14px]'
              className='text-primarycolor mb-[10px] block'
            >
              {userAccount}
            </Txt>
          </div>
        </div>
      </div>
    </div>
  );
}
