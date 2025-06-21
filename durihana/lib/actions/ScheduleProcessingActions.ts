'use server';

import prisma from '@/lib/db';
import { formatDate } from '@/lib/utils';

/**
 * - 예금(type=1) 만기: 입출금(type=0) 계좌에 (원금+이자) 입금
 * - 적금(type=2) 매월: 입출금 계좌에서 payment 차감
 * - 적금(type=2) 만기: 입출금 계좌에 (원금+이자) 입금
 * - 대출(type=3) 매월: 입출금 계좌에서 payment 차감
 */
export async function processTodayTransfers(userId: number) {
  const today = formatDate(new Date());

  // 오늘의 모든 금융 일정 조회 (type 1,2,3)
  const schedules = await prisma.userCalendar.findMany({
    where: {
      user_id: userId,
      user_date: { startsWith: today },
      type: { in: [1, 2, 3] },
    },
  });

  // 입출금 계좌(type=0) 조회
  const checking = await prisma.account.findFirst({
    where: { user_id: userId, type: 0 },
  });
  if (!checking) return;

  let balance = checking.balance;

  for (const sch of schedules) {
    // 해당 금융 상품 계좌(type = sch.type) 조회
    const prodAccount = await prisma.account.findFirst({
      where: { user_id: userId, type: sch.type },
    });
    if (!prodAccount) continue;

    const isExpiry =
      prodAccount.expire_date &&
      sch.user_date.startsWith(prodAccount.expire_date);

    let delta = 0;

    if (sch.type === 1) {
      // 예금 만기: principal + interest
      if (isExpiry) {
        const principal = prodAccount.balance;
        // 동적 예금 이자율 조회
        const rateEntry = await prisma.depositInterest.findUnique({
          where: { step: 1 },
        });
        const rate = rateEntry?.rate.toNumber() ?? 0;
        const interest = Math.round(principal * (rate / 100));
        delta = principal + interest;
      } else {
        continue; // 예금은 만기만 처리
      }
    } else if (sch.type === 2) {
      // 적금: 매월 납입(-payment), 만기 시 principal+interest
      if (isExpiry) {
        const principal = prodAccount.balance;
        // 만기 스텝은 전체 스케줄 개수
        const totalSteps = await prisma.savingsInterest.count();
        const rateEntry = await prisma.savingsInterest.findUnique({
          where: { step: totalSteps },
        });
        const rate = rateEntry?.rate.toNumber() ?? 0;
        const interest = Math.round(principal * (rate / 100));
        delta = principal + interest;
      } else {
        delta = -(prodAccount.payment ?? 0);
      }
    } else if (sch.type === 3) {
      // 대출: 매월 상환(-payment), 만기엔 0
      if (!isExpiry) {
        delta = -(prodAccount.payment ?? 0);
      } else {
        delta = 0;
      }
    }

    if (delta === 0) continue;

    // 입출금 계좌 잔액 업데이트
    balance += delta;
    await prisma.account.update({
      where: { id: checking.id },
      data: { balance },
    });

    // 트랜잭션 기록
    await prisma.transaction.create({
      data: {
        account_id: checking.id,
        transaction_date: new Date().toISOString(),
        amount: delta,
        balance,
      },
    });
  }
}
