'use client';

import { useContext } from 'react';
import { AgreementContext } from './agreeementContext';

export const useAgreement = () => {
  const context = useContext(AgreementContext);

  if (!context) {
    throw new Error('useAgreement 에러');
  }

  return context;
};
