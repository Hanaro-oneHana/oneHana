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

// 단일 계좌 생성 함수
export const createAccount = async (
  userId: number,
  accountType: number,
  transferDay = 15,
  expireYears = 1
) => {
  try {
    const currentDate = new Date();
    const expireDate = new Date();
    expireDate.setFullYear(currentDate.getFullYear() + expireYears);

    const accountData: any = {
      account: `530-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
      balance: Math.floor(Math.random() * 50000000) + 1000000, // 100만원 ~ 5000만원
      type: accountType,
      user_id: userId,
    };

    // 계좌 타입별 설정
    switch (accountType) {
      case 0: // 입출금
        // 입출금은 만료일, 이체일 없음
        break;
      case 1: // 예금
        accountData.expire_date = expireDate.toISOString().split('T')[0];
        break;
      case 2: // 적금
        accountData.expire_date = expireDate.toISOString().split('T')[0];
        accountData.transfer_date = String(transferDay); // 선택한 날짜
        accountData.payment = 500000; // 50만원 납입
        break;
      case 3: // 대출
        accountData.expire_date = expireDate.toISOString().split('T')[0];
        accountData.transfer_date = String(transferDay); // 선택한 날짜
        accountData.payment = 300000; // 30만원 상환
        break;
    }

    // 계좌 생성
    const account = await prisma.account.create({
      data: accountData,
    });

    console.log('🚀 ~ Created account:', account);

    // UserCalendar에 관련 일정들 자동 생성
    const scheduleResult = await createAccountSchedules(account.id);

    return {
      success: true,
      account,
      schedulesCreated: scheduleResult.count,
    };
  } catch (error) {
    console.error('Failed to create account:', error);
    throw error;
  }
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
