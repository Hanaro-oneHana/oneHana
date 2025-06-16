'use client';

import InputComponent from '@/components/atoms/InputComponent';
import Txt from '@/components/atoms/Txt';

type LoanFormProps = {
  amount: string;
  period: number;
  userAccount: string;
  onAmountChange: (value: string) => void;
  onPeriodChange: (period: number) => void;
};

export default function LoanForm({
  amount,
  period,
  userAccount,
  onAmountChange,
  onPeriodChange,
}: LoanFormProps) {
  return (
    <div className='flex-1 px-6 py-8'>
      <Txt
        size='text-[24px]'
        weight='font-[600]'
        className='text-mainblack mb-8'
      >
        두리아나대출통장
      </Txt>

      <div className='space-y-6'>
        <div>
          <Txt
            size='text-[16px]'
            weight='font-[500]'
            className='text-mainblack mb-4'
          >
            얼마를 대출받을까요?
          </Txt>
          <div className='flex items-center gap-2 mb-4'>
            <Txt size='text-[14px]' className='text-gray-600'>
              최소
            </Txt>
            <div className='relative'>
              <InputComponent
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder='100만원'
                className='text-[16px] font-[600] text-mainblack border-b-2 border-gray-300 bg-transparent px-0 pb-1'
              />
            </div>
            <Txt size='text-[14px]' className='text-gray-600'>
              을
            </Txt>
            <select
              value={period}
              onChange={(e) => onPeriodChange(Number(e.target.value))}
              className='text-[16px] font-[600] text-primarycolor bg-transparent border-b-2 border-primarycolor outline-none pb-1'
            >
              <option value={12}>12개월</option>
              <option value={24}>24개월</option>
            </select>
            <Txt size='text-[14px]' className='text-gray-600'>
              만기로 대출
            </Txt>
          </div>
        </div>

        <div>
          <Txt
            size='text-[16px]'
            weight='font-[500]'
            className='text-mainblack mb-2'
          >
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
