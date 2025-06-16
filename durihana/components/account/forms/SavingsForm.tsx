'use client';

import InputComponent from '@/components/atoms/InputComponent';
import Txt from '@/components/atoms/Txt';

type SavingsFormProps = {
  amount: string;
  period: number;
  transferDay: number;
  userAccount: string;
  onAmountChange: (value: string) => void;
  onPeriodChange: (period: number) => void;
  onTransferDayChange: (day: number) => void;
};

export default function SavingsForm({
  amount,
  period,
  transferDay,
  userAccount,
  onAmountChange,
  onPeriodChange,
  onTransferDayChange,
}: SavingsFormProps) {
  return (
    <div className='flex-1 px-6 py-8'>
      <Txt size='text-[22px]' className='text-mainblack mb-8'>
        두리아나적금통장
      </Txt>

      <div className='space-y-6'>
        <div>
          <Txt size='text-[16px]' className='text-mainblack mb-4'>
            얼마를 저축할까요?
          </Txt>
          <div className='flex items-center gap-2 mb-4'>
            <Txt size='text-[14px]' className='text-icongray'>
              최소
            </Txt>
            <div className='relative'>
              <InputComponent
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder='100만원'
                className='text-[14px] font-[400] text-icongray border-b-2 border-gray-300 bg-transparent px-0 pb-1'
              />
            </div>
            <Txt size='text-[12px]' className='text-mainblack'>
              을
            </Txt>
            <select
              value={period}
              onChange={(e) => onPeriodChange(Number(e.target.value))}
              className='text-[14px] font-[400] text-primarycolor bg-transparent border-b-2 border-primarycolor outline-none pb-1'
            >
              <option value={12}>12개월</option>
              <option value={24}>24개월</option>
            </select>
            <Txt size='text-[12px]' className='text-mainblack'>
              만기로 저축
            </Txt>
          </div>
        </div>

        <div>
          <Txt size='text-[16px]' className='text-mainblack mb-4'>
            정기적으로 저축합니다
          </Txt>
          <div className='flex items-center gap-2 mb-4'>
            <div className='relative'>
              <InputComponent
                value={amount || '위에서 설정한 금액'}
                readOnly
                className='text-[14px] font-[400] text-primarycolor border-b-2 border-primarycolor bg-transparent px-0 pb-1'
              />
            </div>
            <Txt size='text-[12px]' className='text-mainblack'>
              을
            </Txt>
            <select
              value={transferDay}
              onChange={(e) => onTransferDayChange(Number(e.target.value))}
              className='text-[14px] font-[400] text-primarycolor bg-transparent border-b-2 border-primarycolor outline-none pb-1'
            >
              <option value={13}>매월 13일</option>
              <option value={15}>매월 15일</option>
              <option value={20}>매월 20일</option>
              <option value={25}>매월 25일</option>
            </select>
            <Txt size='text-[12px]' className='text-mainblack'>
              에 출금
            </Txt>
          </div>
        </div>

        <div>
          <Txt size='text-[16px]' className='text-mainblack mb-2'>
            만기 시
          </Txt>
          <div className='flex items-center gap-2 mb-4'>
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
          <Txt size='text-[16px]' className='text-mainblack mb-2'>
            아래 계좌에서 출금됩니다
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
