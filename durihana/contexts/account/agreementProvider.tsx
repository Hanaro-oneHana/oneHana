'use client';

import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { AgreementContext } from './agreeementContext';

export const AgreementProvider = ({ children }: PropsWithChildren) => {
  const [baseAgree, setBaseAgree] = useState(false);
  const [depositAgree, setDepositAgree] = useState(false);
  const [savingsAgree, setSavingsAgree] = useState(false);
  const [loanAgree, setLoanAgree] = useState(false);

  return (
    <AgreementContext.Provider
      value={{
        baseAgree,
        setBaseAgree,
        depositAgree,
        setDepositAgree,
        savingsAgree,
        setSavingsAgree,
        loanAgree,
        setLoanAgree,
      }}
    >
      {children}
    </AgreementContext.Provider>
  );
};
