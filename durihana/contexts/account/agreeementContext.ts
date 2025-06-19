import { createContext } from 'react';

type AgreementContextProps = {
  baseAgree: boolean;
  setBaseAgree: (value: boolean) => void;
  depositAgree: boolean;
  setDepositAgree: (value: boolean) => void;
  savingsAgree: boolean;
  setSavingsAgree: (value: boolean) => void;
  loanAgree: boolean;
  setLoanAgree: (value: boolean) => void;
};

export const AgreementContext = createContext<AgreementContextProps>({
  baseAgree: false,
  setBaseAgree: (value: boolean) => {},
  depositAgree: false,
  setDepositAgree: (value: boolean) => {},
  savingsAgree: false,
  setSavingsAgree: (value: boolean) => {},
  loanAgree: false,
  setLoanAgree: (value: boolean) => {},
});
