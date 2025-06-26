import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

export type SubAccount = {
  type: 1 | 2 | 3; // 1:예금, 2:적금, 3:대출
  balance: number;
};

export type MainAccount = {
  type: 0;
  account: string;
  balance: number;
};
export type DepositFormProps = {
  amount: string;
  period: number;
  userAccount: string;
  onAmountChange: (value: string) => void;
  onPeriodChange: (period: number) => void;
};

export interface ExpandingInputProps {
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
  readOnly?: boolean;
}

export type LoanFormProps = {
  amount: string;
  period: number;
  userAccount: string;
  onAmountChange: (value: string) => void;
  onPeriodChange: (period: number) => void;
  onTransferDayChange: (day: number) => void;
  monthlyPayment?: string;
  transferDay?: number;
  onMonthlyPaymentChange?: (value: string) => void;
};

export type SavingsFormProps = {
  amount: string; // 총 적금액
  period: number; // 개월 수
  transferDay: number; // 매월 납입일
  userAccount: string; // 입금계좌 정보
  onAmountChange: (value: string) => void; // 총액 변경
  onPeriodChange: (period: number) => void; // 개월 수 변경
  onTransferDayChange: (day: number) => void; // 납입일 변경
};

export type FormState = {
  type: number;
  amount: string;
  period: number;
  transferDay: number;
  userAccount: string;
  monthlyPayment?: string;
};

export type Stage = 'form' | 'review' | 'complete';

export type NavigationProps = {
  currentStage: Stage;
  setCurrentStage: (stage: Stage) => void;
  step: number;
  setStep: (step: number) => void;
  types: number[];
  formStatesLength: number;
  createAccounts: () => Promise<void>;
  router: ReturnType<typeof useRouter>;
};
