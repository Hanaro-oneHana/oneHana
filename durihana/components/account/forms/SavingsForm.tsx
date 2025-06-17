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

type SavingsFormProps = {
  amount: string; // 총 적금액
  period: number; // 개월 수
  transferDay: number; // 매월 납입일
  userAccount: string; // 입금계좌 정보
  onAmountChange: (value: string) => void; // 총액 변경
  onPeriodChange: (period: number) => void; // 개월 수 변경
  onTransferDayChange: (day: number) => void; // 납입일 변경

  // ↓ 추가된 부분
  monthlyDeposit?: string; // 월납입액
  onMonthlyDepositChange?: (value: string) => void;
};

export default function SavingsForm({
  amount,
  period,
  transferDay,
  userAccount,
  onAmountChange,
  onPeriodChange,
  onTransferDayChange,
  monthlyDeposit = '',
  onMonthlyDepositChange,
}: SavingsFormProps) {
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // 예상 월납입액 계산 (간단히 총액/개월수)
  const principal = Number.parseInt(amount.replace(/,/g, '')) || 0;
  const estimatedDeposit = period
    ? Math.round(principal / period).toLocaleString()
    : '0';

  return (
    <div className='flex-1 px-6 py-8'>
      <Txt size='text-[22px]' className='block text-mainblack mb-[40px]'>
        두리하나적금통장
      </Txt>

      <div className='space-y-6'>
        {/* 1. 총적금액 입력 */}
        <div>
          <Txt size='text-[16px]' className='block text-mainblack mb-[20px]'>
            얼마를 저축할까요?
          </Txt>
          <div className='flex items-end gap-2 mb-[40px]'>
            <ExpandingInput
              value={
                amount ? Number(amount.replace(/,/g, '')).toLocaleString() : ''
              }
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder='최소 100만원'
              className='text-[14px] font-[400] leading-[24px] text-icongray border-b-[0.5px] border-mainblack bg-transparent px-0 pb-0 flex-none'
            />
            <Txt size='text-[12px]' className='text-mainblack'>
              을
            </Txt>

            <DropdownMenu open={isPeriodOpen} onOpenChange={setIsPeriodOpen}>
              <DropdownMenuTrigger className='min-w-[60px] flex items-center gap-1 text-[14px] font-[400] leading-[24px] text-primarycolor bg-transparent border-b-[0.5px] border-mainblack pb-1'>
                {period}개월
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isPeriodOpen ? 'rotate-180' : ''
                  }`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[90px]' align='start'>
                {[12, 24, 36, 48].map((m) => (
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
              만기로 저축
            </Txt>
          </div>
        </div>

        {/* 2. 월납입액 입력 */}
        <div>
          <Txt size='text-[16px]' className='block text-mainblack mb-[20px]'>
            매월 얼마씩 저축할까요?
          </Txt>
          <div className='flex items-end gap-2 mb-[20px]'>
            <ExpandingInput
              value={monthlyDeposit}
              onChange={(e) => onMonthlyDepositChange?.(e.target.value)}
              placeholder={`예상 ${estimatedDeposit}원`}
              className='text-[14px] font-[400] leading-[24px] text-icongray
                         border-b-[0.5px] border-mainblack bg-transparent
                         px-0 pb-0 flex-none'
            />
            <Txt size='text-[12px]' className='text-mainblack'>
              씩 저축
            </Txt>
          </div>
          <Txt size='text-[12px]' className='text-gray-500 mb-[40px]'>
            * 예상 월납입액: {estimatedDeposit}원
          </Txt>
        </div>

        {/* 3. 납입일 선택 */}
        <div>
          <Txt size='text-[16px]' className='block text-mainblack mb-[20px]'>
            언제 저축할까요?
          </Txt>
          <div className='flex items-end gap-2 mb-[42px]'>
            <Txt size='text-[12px]' className='text-mainblack'>
              매월
            </Txt>
            <DropdownMenu
              open={isTransferOpen}
              onOpenChange={setIsTransferOpen}
            >
              <DropdownMenuTrigger
                className='min-w-[40px] flex items-center gap-1
                                            text-[14px] font-[400] leading-[24px]
                                            text-primarycolor bg-transparent
                                            border-b-[0.5px] border-mainblack pb-1'
              >
                {transferDay}일
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
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
              에 출금
            </Txt>
          </div>
        </div>

        {/* 4. 만기 안내 */}
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

        {/* 5. 입금 계좌 */}
        <div>
          <Txt size='text-[16px]' className='block text-mainblack'>
            아래 계좌로 입금됩니다
          </Txt>
          <div className='space-y-1'>
            <Txt size='text-[12px]' className='text-primarycolor'>
              두리하나입출금통장
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
