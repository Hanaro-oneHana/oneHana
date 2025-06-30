'use client';

import { FormState, Stage } from '@/types/Account';
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
  onChange,
}: Props) {
  if (currentStage === 'form') {
    return <AccountFormRenderer data={current} onChange={onChange} />;
  }

  if (currentStage === 'review') {
    return <LoanReviewStep />;
  }

  if (currentStage === 'complete') {
    return <CompleteStep />;
  }

  return null;
}
