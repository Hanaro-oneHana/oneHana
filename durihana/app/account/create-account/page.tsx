'use client';

import DepositForm from '@/components/account/forms/DepositForm';
import LoanForm from '@/components/account/forms/LoanForm';
import SavingsForm from '@/components/account/forms/SavingsForm';
import CompleteStep from '@/components/account/steps/CompleteStep';
import LoanReviewStep from '@/components/account/steps/LoanReviewStep';
import Button from '@/components/atoms/Button';
import Header from '@/components/atoms/Header';
import Txt from '@/components/atoms/Txt';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

// 화면 폼 상태 타입
type FormState = {
  type: number;
  amount: string;
  period: number;
  transferDay: number;
  userAccount: string;
};

export default function CreateAccount() {
  const router = useRouter();
  const params = useSearchParams();
  const types = (params.get('types') || '')
    .split(',')
    .map(Number)
    .filter(Boolean);

  // 상태 관리
  const [formStates, setFormStates] = useState<FormState[]>(
    types.map((type) => ({
      type,
      amount: '',
      period: 12,
      transferDay: 1,
      userAccount: '530-910028-53607',
    }))
  );
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<'form' | 'review' | 'complete'>('form');
  const [loading, setLoading] = useState(false);
  const current = formStates[step];

  // 폼 업데이트 헬퍼
  const updateCurrent = (updates: Partial<FormState>) =>
    setFormStates((fs) =>
      fs.map((f, i) => (i === step ? { ...f, ...updates } : f))
    );

  // 이전 단계
  const handleBack = () => {
    if (stage === 'complete') {
      setStage(current.type === 3 ? 'review' : 'form');
    } else if (stage === 'review') {
      setStage('form');
    } else if (step > 0) {
      setStep(step - 1);
    } else {
      router.push('/account/else-account');
    }
  };

  // 다음 단계
  const handleNext = async () => {
    if (stage === 'form') {
      if (current.type === 3) return setStage('review');
      return advanceStep();
    }
    if (stage === 'review') return advanceStep();

    // complete
    setLoading(true);
    try {
      // 서버 호출 로직
      console.log('creating', formStates);
      await new Promise((r) => setTimeout(r, 1000));
      alert('모든 계좌 생성이 완료되었습니다!');
      router.push('/');
    } catch {
      alert('계좌 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  const advanceStep = () => {
    if (step + 1 < formStates.length) {
      setStep(step + 1);
      setStage('form');
    } else {
      setStage('complete');
    }
  };

  // 렌더링
  if (!types.length) return <Txt>약관 동의 페이지로 이동 중...</Txt>;

  const renderContent = () => {
    if (stage === 'review') return <LoanReviewStep />;
    if (stage === 'complete')
      return (
        <CompleteStep
          accountType={current.type}
          isLastAccount={step + 1 >= formStates.length}
        />
      );
    // form 단계
    switch (current.type) {
      case 1:
        return (
          <DepositForm
            amount={current.amount}
            period={current.period}
            userAccount={current.userAccount}
            onAmountChange={(v) => updateCurrent({ amount: v })}
            onPeriodChange={(p) => updateCurrent({ period: p })}
          />
        );
      case 2:
        return (
          <SavingsForm
            amount={current.amount}
            period={current.period}
            transferDay={current.transferDay}
            userAccount={current.userAccount}
            onAmountChange={(v) => updateCurrent({ amount: v })}
            onPeriodChange={(p) => updateCurrent({ period: p })}
            onTransferDayChange={(d) => updateCurrent({ transferDay: d })}
          />
        );
      case 3:
        return (
          <LoanForm
            amount={current.amount}
            period={current.period}
            transferDay={current.transferDay}
            userAccount={current.userAccount}
            onAmountChange={(v) => updateCurrent({ amount: v })}
            onPeriodChange={(p) => updateCurrent({ period: p })}
            onTransferDayChange={(d) => updateCurrent({ transferDay: d })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='w-full max-w-md mx-auto bg-mainwhite h-screen flex flex-col'>
      <Header
        leftIcon='back'
        title={`상품 가입 (${step + 1}/${formStates.length})`}
        onBackClick={handleBack}
      />
      <div className='flex-1 overflow-y-auto'>{renderContent()}</div>
      <div className='p-6'>
        <Button
          onClick={handleNext}
          disabled={stage === 'form' && !current.amount}
          className='w-full bg-primarycolor text-white py-4 rounded-lg'
        >
          {loading ? '처리 중...' : stage === 'complete' ? '완료' : '다음'}
        </Button>
      </div>
    </div>
  );
}
