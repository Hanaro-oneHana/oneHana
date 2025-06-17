'use client';

import type { Stage } from './useAccountCreation';

type NavigationProps = {
  currentStage: Stage;
  setCurrentStage: (stage: Stage) => void;
  step: number;
  setStep: (step: number) => void;
  types: number[];
  formStatesLength: number;
  createAccounts: () => Promise<void>;
  router: any;
};

export function useAccountNavigation({
  currentStage,
  setCurrentStage,
  step,
  setStep,
  types,
  formStatesLength,
  createAccounts,
  router,
}: NavigationProps) {
  const handleBack = () => {
    if (currentStage === 'complete') {
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

  const handleNext = async (currentType: number) => {
    if (currentStage === 'form') {
      if (currentType === 3) {
        setCurrentStage('review');
      } else {
        advanceToNextStep();
      }
    } else if (currentStage === 'review') {
      advanceToNextStep();
    } else if (currentStage === 'complete') {
      await createAccounts();
    }
  };

  const advanceToNextStep = () => {
    const isLastAccount = step + 1 >= formStatesLength;
    if (isLastAccount) {
      setCurrentStage('complete');
    } else {
      setStep(step + 1);
      setCurrentStage('form');
    }
  };

  return { handleBack, handleNext };
}
