'use client';

import { FormState, Stage } from '@/types/Account';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
  createMultipleAccounts,
  getAllAccountsByUserId,
} from '@/lib/actions/AccountActions';
import { socket } from '@/lib/socket-client';

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

  useEffect(() => {
    if (!session?.user?.id) return;
    // 회원의 모든 계좌 조회
    getAllAccountsByUserId(Number(session.user.id)).then((accounts) => {
      // 첫 번째 계좌(입출금 통장)를 userAccount에 채워줌
      const defaultAccount = accounts[0]?.account ?? '';
      setFormStates((fs) =>
        fs.map((f) => ({
          ...f,
          userAccount: defaultAccount,
        }))
      );
    });
  }, [session?.user?.id]);
  const [step, setStep] = useState(0);
  const [currentStage, setCurrentStage] = useState<Stage>('form');
  const [loading, setLoading] = useState(false);

  const current = formStates[step];

  // 타입이 없으면 리다이렉트
  useEffect(() => {
    if (types.length === 0) {
      router.push('./else-account');
    }
  }, [types]);

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

      if (result.isSuccess && result.socketData) {
        socket.emit('admin-balance-update', {
          uids: result.socketData.coupleUserIds,
          payload: {
            accountId: result.socketData.accountId,
            newBalance: result.socketData.newBalance,
            accountType: result.socketData.accountType,
            coupleBalance: result.socketData.coupleBalance,
          },
        });
        router.push('/');
      }
    } catch (error) {
      console.error('계좌 생성 실패:', error);
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
