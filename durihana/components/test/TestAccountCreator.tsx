'use client';

import { ACCOUNT_TYPES } from '@/types/Schedule';
import { useState } from 'react';
import {
  createTestAccount,
  deleteTestAccounts,
} from '@/lib/actions/TestAccountActions';
import Button from '../atoms/Button';
import Txt from '../atoms/Txt';

type TestAccountCreatorProps = {
  userId: number;
  onAccountCreated?: () => void;
};

export default function TestAccountCreator({
  userId,
  onAccountCreated,
}: TestAccountCreatorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [selectedAccountType, setSelectedAccountType] = useState<number>(2); // 기본값: 적금
  const [transferDay, setTransferDay] = useState<number>(15); // 기본값: 15일
  const [expireYears, setExpireYears] = useState<number>(1); // 기본값: 1년

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      setResult('');

      const response = await createTestAccount(
        userId,
        selectedAccountType,
        transferDay,
        expireYears
      );

      if (response.success) {
        setResult(
          `${ACCOUNT_TYPES[selectedAccountType as keyof typeof ACCOUNT_TYPES]} 계좌 생성 완료! (일정 ${response.schedulesCreated}개 생성됨)`
        );
        onAccountCreated?.();
      }
    } catch (error) {
      setResult('계좌 생성 실패: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllAccounts = async () => {
    try {
      setLoading(true);
      setResult('');

      const response = await deleteTestAccounts(userId);

      if (response.success) {
        setResult(
          `모든 테스트 데이터 삭제 완료! (계좌 ${response.accountsDeleted}개, 일정 ${response.schedulesDeleted}개 삭제됨)`
        );
        onAccountCreated?.();
      }
    } catch (error) {
      setResult('삭제 실패: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const needsTransferDay =
    selectedAccountType === 2 || selectedAccountType === 3; // 적금, 대출
  const needsExpireDate = selectedAccountType !== 0; // 입출금 제외

  return (
    <div className='p-4 bg-gray-50 rounded-lg space-y-4'>
      <Txt size='text-[16px]' weight='font-[600]' className='text-mainblack'>
        테스트 계좌 생성
      </Txt>

      {/* 계좌 타입 선택 */}
      <div className='space-y-2'>
        <Txt size='text-[14px]' weight='font-[500]' className='text-gray-700'>
          계좌 타입
        </Txt>
        <div className='grid grid-cols-2 gap-2'>
          {Object.entries(ACCOUNT_TYPES).map(([type, name]) => (
            <Button
              key={type}
              onClick={() => setSelectedAccountType(Number(type))}
              className={`text-sm ${
                selectedAccountType === Number(type)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>

      {/* 납입/상환일 선택 (적금, 대출만) */}
      {needsTransferDay && (
        <div className='space-y-2'>
          <Txt size='text-[14px]' weight='font-[500]' className='text-gray-700'>
            {selectedAccountType === 2 ? '납입일' : '상환일'}
          </Txt>
          <div className='grid grid-cols-5 gap-2'>
            {[5, 10, 15, 20, 25].map((day) => (
              <Button
                key={day}
                onClick={() => setTransferDay(day)}
                className={`text-sm ${
                  transferDay === day
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {day}일
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 만료 기간 선택 (입출금 제외) */}
      {needsExpireDate && (
        <div className='space-y-2'>
          <Txt size='text-[14px]' weight='font-[500]' className='text-gray-700'>
            만료 기간
          </Txt>
          <div className='grid grid-cols-2 gap-2'>
            {[1, 2].map((years) => (
              <Button
                key={years}
                onClick={() => setExpireYears(years)}
                className={`text-sm ${
                  expireYears === years
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {years}년
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 생성 및 삭제 버튼 */}
      <div className='space-y-2'>
        <Button
          onClick={handleCreateAccount}
          disabled={loading}
          className='w-full bg-blue-600 text-white'
        >
          {loading ? '생성 중...' : '계좌 생성'}
        </Button>

        <Button
          onClick={handleDeleteAllAccounts}
          disabled={loading}
          className='w-full bg-red-500 text-white'
        >
          모든 테스트 데이터 삭제
        </Button>
      </div>

      {/* 결과 표시 */}
      {result && (
        <div className='p-3 bg-white rounded border'>
          <Txt size='text-[14px]' className='text-gray-700'>
            {result}
          </Txt>
        </div>
      )}

      {/* 선택된 옵션 요약 */}
      <div className='p-3 bg-blue-50 rounded border border-blue-200'>
        <Txt size='text-[12px]' className='text-blue-800'>
          <strong>선택된 옵션:</strong>
          <br />
          계좌 타입:{' '}
          {ACCOUNT_TYPES[selectedAccountType as keyof typeof ACCOUNT_TYPES]}
          {needsTransferDay && (
            <>
              <br />
              {selectedAccountType === 2 ? '납입일' : '상환일'}: 매월{' '}
              {transferDay}일
            </>
          )}
          {needsExpireDate && (
            <>
              <br />
              만료 기간: {expireYears}년 후
            </>
          )}
        </Txt>
      </div>
    </div>
  );
}
