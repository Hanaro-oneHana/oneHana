'use client';

import DepositForm from '@/components/account/forms/DepositForm';
import LoanForm from '@/components/account/forms/LoanForm';
import SavingsForm from '@/components/account/forms/SavingsForm';
import CompleteStep from '@/components/account/steps/CompleteStep';
import LoanReviewStep from '@/components/account/steps/LoanReviewStep';
import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Txt';
import { useState } from 'react';

export default function TestComponentsPage() {
  const [currentComponent, setCurrentComponent] = useState<string>('deposit');
  const [formData, setFormData] = useState({
    amount: '1,000,000',
    period: 12,
    transferDay: 13,
  });

  const userAccount = '530-910028-53607';

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setFormData({ ...formData, amount: formattedValue });
  };

  const components = [
    { key: 'deposit', label: '예금 폼' },
    { key: 'savings', label: '적금 폼' },
    { key: 'loan', label: '대출 폼' },
    { key: 'loanReview', label: '대출 심사' },
    { key: 'complete', label: '완료 단계' },
  ];

  return (
    <div className='w-full max-w-md mx-auto bg-mainwhite h-screen flex flex-col'>
      <div className='flex-1 px-6 py-8 bg-gray-50'>
        <div className='p-4 border-b border-gray-100'>
          <Txt
            size='text-[18px]'
            weight='font-[600]'
            className='text-mainblack mb-4 text-center'
          >
            컴포넌트 테스트
          </Txt>
          <div className='flex flex-wrap gap-2'>
            {components.map((comp) => (
              <Button
                key={comp.key}
                onClick={() => setCurrentComponent(comp.key)}
                className={`px-3 py-1 text-sm rounded-full ${
                  currentComponent === comp.key
                    ? 'bg-primarycolor text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {comp.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 컴포넌트 렌더링 */}
        <div className='flex-1 overflow-y-auto'>
          {currentComponent === 'deposit' && (
            <DepositForm
              amount={formData.amount}
              period={formData.period}
              userAccount={userAccount}
              onAmountChange={handleAmountChange}
              onPeriodChange={(period) => setFormData({ ...formData, period })}
            />
          )}

          {currentComponent === 'savings' && (
            <SavingsForm
              amount={formData.amount}
              period={formData.period}
              transferDay={formData.transferDay}
              userAccount={userAccount}
              onAmountChange={handleAmountChange}
              onPeriodChange={(period) => setFormData({ ...formData, period })}
              onTransferDayChange={(transferDay) =>
                setFormData({ ...formData, transferDay })
              }
            />
          )}

          {currentComponent === 'loan' && (
            <LoanForm
              amount={formData.amount}
              period={formData.period}
              transferDay={formData.transferDay}
              userAccount={userAccount}
              onAmountChange={handleAmountChange}
              onPeriodChange={(period) => setFormData({ ...formData, period })}
              onTransferDayChange={(transferDay) =>
                setFormData({ ...formData, transferDay })
              }
            />
          )}

          {currentComponent === 'loanReview' && <LoanReviewStep />}

          {currentComponent === 'complete' && (
            <CompleteStep accountType={1} isLastAccount={false} />
          )}
        </div>
      </div>
    </div>
  );
}
