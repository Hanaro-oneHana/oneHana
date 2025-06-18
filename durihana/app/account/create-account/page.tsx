'use client';

import AccountCreationContent from '@/components/account/AccountCreationContent';
import { Button, Header, Txt } from '@/components/atoms';
import { useAccountCreation } from '@/hooks/useAccountCreation';
import { useAccountNavigation } from '@/hooks/useAccountNavigation';

export default function CreateAccount() {
  const {
    types,
    step,
    setStep,
    currentStage,
    setCurrentStage,
    loading,
    current,
    updateForm,
    createAccounts,
    router,
    formStates,
  } = useAccountCreation();

  const { handleBack, handleNext } = useAccountNavigation({
    currentStage,
    setCurrentStage,
    step,
    setStep,
    types,
    formStatesLength: formStates.length,
    createAccounts,
    router,
  });

  // 로딩 상태
  if (types.length === 0) {
    return (
      <div className='w-full max-w-md mx-auto bg-mainwhite h-screen flex items-center justify-center'>
        <Txt>약관 동의 페이지로 이동 중...</Txt>
      </div>
    );
  }

  const getButtonText = () => {
    if (loading) return '처리 중...';
    if (currentStage === 'complete') return '완료';
    return '다음';
  };

  const isButtonDisabled =
    (!current?.amount && currentStage === 'form') || loading;

  return (
    <div className='w-full max-w-md mx-auto bg-background h-screen flex flex-col'>
      <Header
        leftIcon='back'
        title={`상품 가입 (${step + 1}/${formStates.length})`}
        onBackClick={handleBack}
      />

      <div className='flex-1 overflow-y-auto pt-[80px]'>
        <AccountCreationContent
          currentStage={currentStage}
          current={current}
          step={step}
          formStatesLength={formStates.length}
          onChange={updateForm}
        />
      </div>

      <div className='p-6'>
        <Button
          onClick={() => handleNext(current.type)}
          disabled={isButtonDisabled}
          className='absolute flex justify-center bottom-[40px] left-[50%] w-[335px] h-[48px] text-[16px] translate-x-[-50%]'
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
