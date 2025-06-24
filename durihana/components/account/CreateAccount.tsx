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
      <div className='w-full max-w-md mx-auto bg-mainwhite h-dvh flex items-center justify-center'>
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
    <div className='flex flex-col w-full mx-auto bg-background h-dvh '>
      <Header
        leftIcon='back'
        title={`상품 가입 (${step + 1}/${formStates.length})`}
        onLeftClick={handleBack}
      />

      <div className='flex flex-1 pt-[80px] pb-[110px]'>
        <AccountCreationContent
          currentStage={currentStage}
          current={current}
          step={step}
          formStatesLength={formStates.length}
          onChange={updateForm}
        />
      </div>

      <div className='fixed bg-background flex justify-center bottom-0 pb-[40px] left-[50%] w-full  text-[16px] translate-x-[-50%] px-[20px]'>
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
