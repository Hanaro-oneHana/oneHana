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
      <div className='bg-mainwhite mx-auto flex h-dvh w-full max-w-md items-center justify-center'>
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
    <div className='bg-background mx-auto flex h-dvh w-full flex-col'>
      <Header
        leftIcon='back'
        title={`상품 가입 (${step + 1}/${formStates.length})`}
        onLeftClick={handleBack}
      />

      <div className='flex flex-1 overflow-y-auto pb-[110px]'>
        <AccountCreationContent
          currentStage={currentStage}
          current={current}
          step={step}
          formStatesLength={formStates.length}
          onChange={updateForm}
        />
      </div>

      <div className='bg-background fixed bottom-0 left-[50%] flex w-full translate-x-[-50%] justify-center px-[20px] pb-[40px] text-[16px]'>
        <Button
          className='h-[48px]'
          onClick={() => handleNext(current.type)}
          disabled={isButtonDisabled}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
