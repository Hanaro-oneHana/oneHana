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
const descriptions: Record<number, string> = {
  1: '예금', // deposit
  2: '적금', // savings
  3: '대출', // loan
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

      // 입출금 계좌 조회 (type=0)
      const mainAccount = await tx.account.findFirst({
        where: { user_id: userId, type: 0 },
      });
      if (!mainAccount) throw new Error('입출금 계좌가 존재하지 않습니다.');
      let mainBalance = mainAccount.balance;

      for (const accountData of accountsData) {
        const now = new Date();
        const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const expireDate = new Date(now);
        expireDate.setFullYear(
          now.getFullYear() + Math.floor(accountData.period / 12) || 1
        );

        const dbAccountData: Prisma.AccountUncheckedCreateInput = {
          account: `530-${String(Math.floor(Math.random() * 1e6)).padStart(6, '0')}-${String(Math.floor(Math.random() * 1e5)).padStart(5, '0')}`,
          balance: accountData.amount,
          type: accountData.type,
          user_id: userId,
        };

        // 계좌 생성 전 입출금 계좌 및 트랜잭션 처리
        if (accountData.type === 1) {
          // 예금: 만기일 설정 + 입출금 계좌에서 출금
          dbAccountData.expire_date = expireDate.toISOString().split('T')[0];

          mainBalance -= accountData.amount;
          await tx.account.update({
            where: { id: mainAccount.id },
            data: { balance: mainBalance },
          });
          await tx.transaction.create({
            data: {
              account_id: mainAccount.id,
              transaction_date: formattedNow,
              amount: -accountData.amount,
              description: descriptions[1],
              balance: mainBalance,
            },
          });
        }
        if (accountData.type === 2) {
          dbAccountData.expire_date = expireDate.toISOString().split('T')[0];
          dbAccountData.transfer_date = String(accountData.transferDay || 15);
          dbAccountData.payment = accountData.amount;

          // ─── 입출금 계좌에서 출금 처리 ───
          mainBalance -= accountData.amount;
          await tx.account.update({
            where: { id: mainAccount.id },
            data: { balance: mainBalance },
          });
          await tx.transaction.create({
            data: {
              account_id: mainAccount.id,
              transaction_date: formattedNow,
              amount: -accountData.amount,
              description: descriptions[2],
              balance: mainBalance,
            },
          });
        }
        if (accountData.type === 3) {
          // 대출: 만기일 설정 + 입출금 계좌에 입금
          dbAccountData.expire_date = expireDate.toISOString().split('T')[0];
          dbAccountData.transfer_date = String(accountData.transferDay || 15);
          const loanRateEntry = await tx.loanInterest.findUnique({
            where: { step: 1 },
          });
          const annualRate = Number(loanRateEntry?.rate) || 0;
          const monthlyRate = annualRate / 12 / 100;
          const P = accountData.amount;
          const n = accountData.period;
          dbAccountData.payment = Math.round(
            (P * monthlyRate * Math.pow(1 + monthlyRate, n)) /
              (Math.pow(1 + monthlyRate, n) - 1)
          );

          mainBalance += accountData.amount;
          await tx.account.update({
            where: { id: mainAccount.id },
            data: { balance: mainBalance },
          });
          await tx.transaction.create({
            data: {
              account_id: mainAccount.id,
              transaction_date: formattedNow,
              amount: accountData.amount,
              description: descriptions[3],
              balance: mainBalance,
            },
          });
        }

        // 신규 계좌 생성
        const newAccount = await tx.account.create({ data: dbAccountData });
        createdAccounts.push(newAccount);

        // 신규 계좌에도 트랜잭션 기록: 예금 및 대출 계좌에 금액 입출금 내역
        if (
          accountData.type === 1 ||
          accountData.type === 2 ||
          accountData.type === 3
        ) {
          await tx.transaction.create({
            data: {
              account_id: newAccount.id,
              transaction_date: formattedNow,
              // 예금(type=1) / 적금(type=2): +amount, 대출(type=3): -amount
              amount:
                accountData.type === 3
                  ? -accountData.amount
                  : accountData.amount,
              balance: newAccount.balance,
            },
          });
        }

        // 적금 타입 세부 로직

        // 스케줄 생성
        const scheduleResult = await createAccountSchedules(newAccount.id, tx);
        totalSchedules += scheduleResult.count;
      }

      return { accounts: createdAccounts, totalSchedules };
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
