'use server';

import prisma from '@/lib/db';
import { Decimal } from '../generated/prisma/runtime/library';

async function getStepByCount(
  userId: number,
  model: {
    findFirst: (args: {
      orderBy: { step: 'desc' };
    }) => Promise<{ step: number } | null>;
  }
): Promise<number> {
  // 1) 예약 건수 조회
  const count = await prisma.partnerCalendar.count({
    where: { user_id: userId },
  });

  // 2) 기본 스텝(1)에 count를 더함
  const desired = count;

  // 3) 테이블 상 최대 스텝 조회
  const maxEntry = await model.findFirst({ orderBy: { step: 'desc' } });
  const maxStep = maxEntry?.step ?? desired;

  return Math.min(desired, maxStep);
}

/** 예금 이자율 조회 */
export async function getDepositInterestRate(userId: number): Promise<number> {
  const step = await getStepByCount(userId, prisma.depositInterest);
  const entry = await prisma.depositInterest.findUnique({ where: { step } });
  return entry?.rate.toNumber() ?? 0;
}

/** 적금 이자율 조회 */
export async function getSavingsInterestRate(userId: number): Promise<number> {
  const step = await getStepByCount(userId, prisma.savingsInterest);
  const entry = await prisma.savingsInterest.findUnique({ where: { step } });
  return entry?.rate.toNumber() ?? 0;
}

/** 대출 이자율 조회 */
export async function getLoanInterestRate(userId: number): Promise<number> {
  const step = await getStepByCount(userId, prisma.loanInterest);
  const entry = await prisma.loanInterest.findUnique({ where: { step } });
  return entry?.rate.toNumber() ?? 0;
}

export async function getDepositInterestRates(): Promise<
  { step: number; rate: number }[]
> {
  const entries = await prisma.depositInterest.findMany({
    orderBy: { step: 'asc' },
  });
  return entries.map((e) => ({
    step: e.step,
    rate: typeof e.rate === 'number' ? e.rate : e.rate.toNumber(),
  }));
}

export async function getSavingsInterestRates(): Promise<
  { step: number; rate: number }[]
> {
  const entries = await prisma.savingsInterest.findMany({
    orderBy: { step: 'asc' },
  });
  return entries.map((e) => ({
    step: e.step,
    rate: typeof e.rate === 'number' ? e.rate : e.rate.toNumber(),
  }));
}

export async function getAllInterestRates() {
  const depositInterestRates = await prisma.depositInterest.findMany({
    orderBy: { step: 'asc' },
  });

  const savingsInterestRates = await prisma.savingsInterest.findMany({
    orderBy: { step: 'asc' },
  });

  const loanInterestRates = await prisma.loanInterest.findMany({
    orderBy: { step: 'asc' },
  });

  const mapRatesToArray = (list: { step: number; rate: Decimal }[]) => {
    const rates = Array(6).fill('-');

    for (const item of list) {
      rates[item.step] = `${item.rate.toNumber().toFixed(2)}%`;
    }

    return rates;
  };

  return [
    { label: '예금', rates: mapRatesToArray(depositInterestRates) },
    { label: '적금', rates: mapRatesToArray(savingsInterestRates) },
    { label: '대출', rates: mapRatesToArray(loanInterestRates) },
  ];
}
