'use client';

import DepositForm from '@/components/account/forms/DepositForm';
import LoanForm from '@/components/account/forms/LoanForm';
import SavingsForm from '@/components/account/forms/SavingsForm';
import CompleteStep from '@/components/account/steps/CompleteStep';
import LoanReviewStep from '@/components/account/steps/LoanReviewStep';
import Button from '@/components/atoms/Button';
import Header from '@/components/atoms/Header';
import Txt from '@/components/atoms/Txt';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// 화면 폼 상태 타입
type FormState = {
  type: number;
  amount: string;
  period: number;
  transferDay: number;
  userAccount: string;
  monthlyPayment?: string; // 대출용 월 상환액 추가
};

type StepRendererProps = {
  data: FormState;
  onChange: (updates: Partial<FormState>) => void;
};

function StepRenderer({ data, onChange }: StepRendererProps) {
  switch (data.type) {
    case 1:
      return (
        <DepositForm
          amount={data.amount}
          period={data.period}
          userAccount={data.userAccount}
          onAmountChange={(v) => onChange({ amount: v })}
          onPeriodChange={(p) => onChange({ period: p })}
        />
      );
    case 2:
      return (
        <SavingsForm
          amount={data.amount}
          period={data.period}
          transferDay={data.transferDay}
          userAccount={data.userAccount}
          onAmountChange={(v) => onChange({ amount: v })}
          onPeriodChange={(p) => onChange({ period: p })}
          onTransferDayChange={(d) => onChange({ transferDay: d })}
        />
      );
    case 3:
      return (
        <LoanForm
          amount={data.amount}
          period={data.period}
          transferDay={data.transferDay}
          userAccount={data.userAccount}
          monthlyPayment={data.monthlyPayment}
          onAmountChange={(v) => onChange({ amount: v })}
          onPeriodChange={(p) => onChange({ period: p })}
          onTransferDayChange={(d) => onChange({ transferDay: d })}
          onMonthlyPaymentChange={(v) => onChange({ monthlyPayment: v })}
        />
      );
    default:
      return null;
  }
}

export default function TestComponentsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const typesParam = params.get('types') || '';
  const types = typesParam
    .split(',')
    .map((t) => Number(t))
    .filter(Boolean);

  // FormState[] 로 화면 상태 관리
  const [formStates, setFormStates] = useState<FormState[]>(
    types.map((type) => ({
      type,
      amount: '',
      period: 12,
      transferDay: 1,
      userAccount: '530-910028-53607',
      monthlyPayment: '', // 대출용 월 상환액 초기화
    }))
  );
  const [step, setStep] = useState(0);
  const [currentStage, setCurrentStage] = useState<
    'form' | 'review' | 'complete'
  >('form');
  const [loading, setLoading] = useState(false);

  const current = formStates[step];

  // 선택된 타입이 없으면 else-account로 리다이렉트
  useEffect(() => {
    if (types.length === 0) {
      router.push('/else-account');
    }
  }, [types, router]);

  // 폼 변경 핸들러
  const handleChange = (updates: Partial<FormState>) => {
    setFormStates((fs) =>
      fs.map((f, i) => (i === step ? { ...f, ...updates } : f))
    );
  };

  // 뒤로가기
  const handleBack = () => {
    if (currentStage === 'complete') {
      // 완료에서 뒤로가기 시 마지막 계좌의 상태로
      const lastType = types[types.length - 1];
      setCurrentStage(lastType === 3 ? 'review' : 'form');
    } else if (currentStage === 'review') {
      setCurrentStage('form');
    } else if (step === 0) {
      router.push('/else-account');
    } else {
      setStep(step - 1);
    }
  };

  // 다음 버튼
  const handleNext = async () => {
    if (currentStage === 'form') {
      if (current.type === 3) {
        // 대출인 경우 심사 단계로
        setCurrentStage('review');
      } else {
        // 예금/적금인 경우
        const isLastAccount = step + 1 >= formStates.length;
        if (isLastAccount) {
          setCurrentStage('complete');
        } else {
          setStep(step + 1);
        }
      }
    } else if (currentStage === 'review') {
      // 대출 심사에서 다음
      const isLastAccount = step + 1 >= formStates.length;
      if (isLastAccount) {
        setCurrentStage('complete');
      } else {
        setStep(step + 1);
        setCurrentStage('form');
      }
    } else if (currentStage === 'complete') {
      // 최종 완료 - 모든 계좌 생성
      setLoading(true);
      try {
        console.log('Creating all accounts:', formStates);
        // 실제 계좌 생성 로직
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert('모든 계좌 생성이 완료되었습니다!');
        router.push('/calendar');
      } catch (error) {
        console.error('계좌 생성 실패:', error);
        alert('계좌 생성에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getAccountTypeName = (type: number) => {
    switch (type) {
      case 1:
        return '예금';
      case 2:
        return '적금';
      case 3:
        return '대출';
      default:
        return '';
    }
  };

  const getProgressText = () => {
    return `${step + 1}/${formStates.length}`;
  };

  // 선택된 타입이 없으면 로딩 표시
  if (types.length === 0) {
    return (
      <div className='w-full max-w-md mx-auto bg-mainwhite h-screen flex items-center justify-center'>
        <Txt>약관 동의 페이지로 이동 중...</Txt>
      </div>
    );
  }

  return (
    <div className='w-full max-w-md mx-auto bg-mainwhite h-screen flex flex-col'>
      {/* Header */}
      <Header
        leftIcon='back'
        title={`상품 가입 (${getProgressText()})`}
        onBackClick={handleBack}
      />

      {/* 콘텐츠 */}
      <div className='flex-1 overflow-y-auto'>
        {currentStage === 'form' && (
          <StepRenderer data={current} onChange={handleChange} />
        )}
        {currentStage === 'review' && <LoanReviewStep />}
        {currentStage === 'complete' && (
          <CompleteStep
            accountType={current.type}
            isLastAccount={step + 1 >= formStates.length}
          />
        )}
      </div>

      {/* 하단 버튼 */}
      <div className='p-6'>
        <Button
          onClick={handleNext}
          disabled={(!current?.amount && currentStage === 'form') || loading}
          className='w-full bg-primarycolor text-white py-4 rounded-lg'
        >
          {loading
            ? '처리 중...'
            : currentStage === 'complete'
              ? '완료'
              : step + 1 >= formStates.length && currentStage !== 'review'
                ? '다음'
                : '다음'}
        </Button>
      </div>
    </div>
  );
}
