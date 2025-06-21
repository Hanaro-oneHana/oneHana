'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { createMultipleAccounts } from '@/lib/actions/AccountActions';

export type FormState = {
  type: number;
  amount: string;
  period: number;
  transferDay: number;
  userAccount: string;
  monthlyPayment?: string;
};

export type Stage = 'form' | 'review' | 'complete';

export function useAccountCreation() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.id) {
      router.push('/auth/signin');
    }
  }, [status, session, router]);

  // URL에서 계좌 타입들 파싱
  const types = (params.get('types') || '')
    .split(',')
    .map(Number)
    .filter(Boolean);

  // 상태 초기화
  const [formStates, setFormStates] = useState<FormState[]>(
    types.map((type) => ({
      type,
      amount: '',
      period: 12,
      transferDay: 1,
      userAccount: '',
      monthlyPayment: '',
    }))
  );

  const [step, setStep] = useState(0);
  const [currentStage, setCurrentStage] = useState<Stage>('form');
  const [loading, setLoading] = useState(false);

  const current = formStates[step];

  // 타입이 없으면 리다이렉트
  useEffect(() => {
    if (types.length === 0) {
      router.push('/else-account');
    }
  }, [types, router]);

  // 폼 업데이트
  const updateForm = (updates: Partial<FormState>) => {
    setFormStates((fs) =>
      fs.map((f, i) => (i === step ? { ...f, ...updates } : f))
    );
  };

  // 계좌 생성 실행
  const createAccounts = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const accountsData = formStates.map((state) => ({
        type: state.type,
        amount: Number.parseInt(state.amount.replace(/,/g, '')) || 0,
        period: state.period,
        transferDay: state.transferDay,
      }));

      const result = await createMultipleAccounts(
        Number(session.user.id),
        accountsData
      );

      if (result.success) {
        alert(
          `${result.accounts.length}개 계좌 생성 완료! ${result.totalSchedules}개 일정이 추가되었습니다.`
        );
        router.push('/calendar');
      } else {
        throw new Error('계좌 생성 실패');
      }
    } catch (error) {
      console.error('계좌 생성 실패:', error);
      alert('계좌 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    types,
    formStates,
    step,
    setStep,
    currentStage,
    setCurrentStage,
    loading,
    current,
    updateForm,
    createAccounts,
    router,
  };
}
