'use server';

import prisma from '../db';
import {
  getDepositInterestRate,
  getLoanInterestRate,
  getSavingsInterestRate,
} from './InterestActions';

export const getUserInfo = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
      marriage_date: true,
    },
  });

  if (!user) return null;

  return {
    이름: user.name,
    이메일: user.email,
    전화번호: user.phone,
    '예정 결혼일': user.marriage_date,
  };
};

export const getInterestsByUserId = async (userId: number) => {
  const accounts = await prisma.account.findMany({
    where: { user_id: userId },
    select: {
      type: true,
    },
  });

  const hasDeposit = accounts.some((account) => account.type === 1);
  const depositInterest = hasDeposit
    ? await getDepositInterestRate(userId)
    : 'X';

  const hasSavings = accounts.some((account) => account.type === 2);
  const savingsInterest = hasSavings
    ? await getSavingsInterestRate(userId)
    : 'X';

  const hasLoan = accounts.some((account) => account.type === 3);
  const loanInterest = hasLoan ? await getLoanInterestRate(userId) : 'X';

  return {
    예금: depositInterest,
    적금: savingsInterest,
    대출: loanInterest,
  };
};
