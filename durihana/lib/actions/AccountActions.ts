'use server';

import { AccountType } from '@/components/AccountDetail';
import prisma from '@/lib/db';
import { Prisma } from '../generated/prisma';
import { createAccountSchedules } from './AccountCalendarActions';

export async function getCheckingAccountByUserId(userId: number) {
  try {
    const checkingAccount = await prisma.account.findFirst({
      where: { user_id: userId, type: 0 },
    });

    console.log(checkingAccount?.id);
    return checkingAccount ? checkingAccount.id : 0;
  } catch (error) {
    console.error('getAccountsByUserId error:', error);
    return 0;
  }
}

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

        const dbAccountData: Prisma.AccountUncheckedCreateInput = {
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
            const loanRateEntry = await tx.loanInterest.findUnique({
              where: { step: 1 },
            });
            const annualRate = Number(loanRateEntry?.rate) || 0;
            const monthlyRate = annualRate / 12 / 100;

            const P = accountData.amount;
            const n = accountData.period;
            const payment = Math.round(
              (P * monthlyRate * Math.pow(1 + monthlyRate, n)) /
                (Math.pow(1 + monthlyRate, n) - 1)
            );

            dbAccountData.payment = payment;
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

export async function getAllAccountsByUserId(userId: number) {
  const accounts = await prisma.account.findMany({
    where: { user_id: userId },
    orderBy: { type: 'asc' },
  });

  return accounts.map((acc) => ({
    ...acc,
    balance: Number(acc.balance),
    type: acc.type as AccountType,
  }));
}

export async function getFirstAccountByUserId(userId: number) {
  const account = await prisma.account.findFirst({
    where: { user_id: userId },
    orderBy: { type: 'asc' },
  });

  if (!account) return null;

  return {
    ...account,
    balance: Number(account.balance),
    type: account.type as AccountType,
  };
}

export async function getCoupleTotalBalance(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mate_code: true },
  });

  if (!user?.mate_code) return 0;

  const couple = await prisma.user.findMany({
    where: { code: user.mate_code },
    select: { id: true },
  });

  const userIds = couple.map((u) => u.id).concat(userId);

  const accounts = await prisma.account.findMany({
    where: {
      user_id: { in: userIds },
      type: 0, // 입출금 계좌
    },
    select: { balance: true },
  });

  return accounts.reduce((sum, acc) => sum + acc.balance, 0);
}
