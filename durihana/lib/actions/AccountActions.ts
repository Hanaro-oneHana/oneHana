'use server';

import prisma from '@/lib/db';
import { createAccountSchedules } from './AccountCalendarActions';

export async function getAccountsByUserId(userId: number) {
  try {
    const accounts = await prisma.account.findMany({
      where: { user_id: userId },
      orderBy: { type: 'asc' },
    });

    return accounts;
  } catch (error) {
    console.error('getAccountsByUserId error:', error);
    return [];
  }
}

export type AccountCreationData = {
  type: number;
  amount: number;
  period: number;
  transferDay?: number;
};
export const createOneAccount = async (userId: number) => {
  const accountNumber = [
    '530',
    String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0'),
    String(Math.floor(Math.random() * 100_000)).padStart(5, '0'),
  ].join('-');

  const account = await prisma.account.create({
    data: {
      user_id: userId,
      account: accountNumber,
      balance: 0,
      type: 0,
    },
  });

  return account;
};
// 여러 계좌를 트랜잭션으로 생성하는 함수
export const createMultipleAccounts = async (
  userId: number,
  accountsData: AccountCreationData[]
) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const createdAccounts = [];
      let totalSchedules = 0;

      for (const accountData of accountsData) {
        const currentDate = new Date();
        const expireDate = new Date();
        expireDate.setFullYear(
          currentDate.getFullYear() + Math.floor(accountData.period / 12) || 1
        );

        const dbAccountData: any = {
          account: `530-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
          balance: accountData.amount,
          type: accountData.type,
          user_id: userId,
        };

        // 계좌 타입별 설정
        switch (accountData.type) {
          case 0: // 입출금
            break;
          case 1: // 예금
            dbAccountData.expire_date = expireDate.toISOString().split('T')[0];
            break;
          case 2: // 적금
            dbAccountData.expire_date = expireDate.toISOString().split('T')[0];
            dbAccountData.transfer_date = String(accountData.transferDay || 15);
            dbAccountData.payment = accountData.amount;
            break;
          case 3: // 대출
            dbAccountData.expire_date = expireDate.toISOString().split('T')[0];
            dbAccountData.transfer_date = String(accountData.transferDay || 15);
            dbAccountData.payment = Math.floor(accountData.amount * 0.1); // 대출 상환액
            break;
        }

        // 계좌 생성
        const account = await tx.account.create({
          data: dbAccountData,
        });

        createdAccounts.push(account);

        // 트랜잭션 내에서 일정 생성 (tx 클라이언트 전달)
        const scheduleResult = await createAccountSchedules(account.id, tx);
        totalSchedules += scheduleResult.count;
      }

      return {
        accounts: createdAccounts,
        totalSchedules,
      };
    });

    return {
      success: true,
      accounts: result.accounts,
      totalSchedules: result.totalSchedules,
    };
  } catch (error) {
    console.error('Failed to create multiple accounts:', error);
    throw error;
  }
};

// 사용자의 모든 계좌 삭제 함수
export const deleteUserAccounts = async (userId: number) => {
  try {
    // 해당 사용자의 모든 계좌 삭제
    const deletedAccounts = await prisma.account.deleteMany({
      where: {
        user_id: userId,
      },
    });

    // 해당 사용자의 모든 UserCalendar 일정 삭제
    const deletedSchedules = await prisma.userCalendar.deleteMany({
      where: {
        user_id: userId,
      },
    });

    return {
      success: true,
      accountsDeleted: deletedAccounts.count,
      schedulesDeleted: deletedSchedules.count,
    };
  } catch (error) {
    console.error('Failed to delete user accounts:', error);
    throw error;
  }
};
