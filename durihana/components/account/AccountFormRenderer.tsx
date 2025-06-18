'use client';

import type { FormState } from '@/hooks/useAccountCreation';
import DepositForm from './forms/DepositForm';
import LoanForm from './forms/LoanForm';
import SavingsForm from './forms/SavingsForm';

type Props = {
  data: FormState;
  onChange: (updates: Partial<FormState>) => void;
};

export default function AccountFormRenderer({ data, onChange }: Props) {
  const commonProps = {
    amount: data.amount,
    period: data.period,
    userAccount: data.userAccount,
    onAmountChange: (v: string) => onChange({ amount: v }),
    onPeriodChange: (p: number) => onChange({ period: p }),
  };

  switch (data.type) {
    case 1:
      return <DepositForm {...commonProps} />;

    case 2:
      return (
        <SavingsForm
          {...commonProps}
          transferDay={data.transferDay}
          onTransferDayChange={(d: number) => onChange({ transferDay: d })}
        />
      );

    case 3:
      return (
        <LoanForm
          {...commonProps}
          transferDay={data.transferDay}
          monthlyPayment={data.monthlyPayment}
          onTransferDayChange={(d: number) => onChange({ transferDay: d })}
          onMonthlyPaymentChange={(v: string) =>
            onChange({ monthlyPayment: v })
          }
        />
      );

    default:
      return null;
  }
}
