'use client';

import type { FormState, Stage } from '@/hooks/useAccountCreation';
import AccountFormRenderer from './AccountFormRenderer';
import CompleteStep from './steps/CompleteStep';
import LoanReviewStep from './steps/LoanReviewStep';

type Props = {
  currentStage: Stage;
  current: FormState;
  step: number;
  formStatesLength: number;
  onChange: (updates: Partial<FormState>) => void;
};

export default function AccountCreationContent({
  currentStage,
  current,
  step,
  formStatesLength,
  onChange,
}: Props) {
  if (currentStage === 'form') {
    return <AccountFormRenderer data={current} onChange={onChange} />;
  }

  if (currentStage === 'review') {
    return <LoanReviewStep />;
  }

  if (currentStage === 'complete') {
    return (
      <CompleteStep
        accountType={current.type}
        isLastAccount={step + 1 >= formStatesLength}
      />
    );
  }

  return null;
}
