'use server';

import prisma from '../db';
import { Prisma } from '../generated/prisma';

// 계좌 생성 시 UserCalendar에 관련 일정들을 자동 생성 (트랜잭션 지원)
export const createAccountSchedules = async (
  accountId: number,
  tx?: Prisma.TransactionClient
) => {
  try {
    const client = tx || prisma;

    // 계좌 정보 조회
    const account = await client.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const schedules: Array<{
      user_id: number;
      user_date: string;
      type: number;
    }> = [];

    // 적금 (type: 2) - 매달 납입일 생성
    if (account.type === 2 && account.transfer_date && account.expire_date) {
      const transferDay = Number.parseInt(account.transfer_date);
      const expireDate = new Date(account.expire_date);
      const startDate = new Date();

      // 매달 납입일 생성 (만료일까지)
      const currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        transferDay
      );

      while (currentDate <= expireDate) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        schedules.push({
          user_id: account.user_id,
          user_date: dateStr,
          type: account.type,
        });

        // 다음 달로 이동
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      // 만료일 일정 추가
      const expireDateStr = `${expireDate.getFullYear()}-${String(expireDate.getMonth() + 1).padStart(2, '0')}-${String(expireDate.getDate()).padStart(2, '0')}`;
      schedules.push({
        user_id: account.user_id,
        user_date: expireDateStr,
        type: account.type,
      });
    }

    // 대출 (type: 3) - 매달 상환일 생성
    if (account.type === 3 && account.transfer_date && account.expire_date) {
      const transferDay = Number.parseInt(account.transfer_date);
      const expireDate = new Date(account.expire_date);
      const startDate = new Date();

      // 매달 상환일 생성 (만료일까지)
      const currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        transferDay
      );

      while (currentDate <= expireDate) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        schedules.push({
          user_id: account.user_id,
          user_date: dateStr,
          type: account.type,
        });

        // 다음 달로 이동
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      // 만료일 일정 추가
      const expireDateStr = `${expireDate.getFullYear()}-${String(expireDate.getMonth() + 1).padStart(2, '0')}-${String(expireDate.getDate()).padStart(2, '0')}`;
      schedules.push({
        user_id: account.user_id,
        user_date: expireDateStr,
        type: account.type,
      });
    }

    // 예금 (type: 1) - 만료일만 생성
    if (account.type === 1 && account.expire_date) {
      const expireDate = new Date(account.expire_date);
      const expireDateStr = `${expireDate.getFullYear()}-${String(expireDate.getMonth() + 1).padStart(2, '0')}-${String(expireDate.getDate()).padStart(2, '0')}`;

      schedules.push({
        user_id: account.user_id,
        user_date: expireDateStr,
        type: account.type,
      });
    }

    // UserCalendar에 일정들 일괄 생성
    if (schedules.length > 0) {
      await client.userCalendar.createMany({
        data: schedules,
        skipDuplicates: true, // 중복 방지
      });
    }

    console.log(
      `Created ${schedules.length} schedules for account ${accountId}`
    );
    return { success: true, count: schedules.length };
  } catch (error) {
    console.error('Failed to create account schedules:', error);
    throw error;
  }
};

// 계좌 삭제 시 관련 일정들도 삭제
export const deleteAccountSchedules = async (accountId: number) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // 해당 계좌와 관련된 모든 일정 삭제 (user_id와 type으로 매칭)
    const result = await prisma.userCalendar.deleteMany({
      where: {
        user_id: account.user_id,
        type: account.type,
      },
    });

    console.log(`Deleted ${result.count} schedules for account ${accountId}`);
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Failed to delete account schedules:', error);
    throw error;
  }
};

// 특정 사용자의 모든 계좌에 대해 일정 생성
export const createAllAccountSchedules = async (userId: number) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { user_id: userId },
    });

    let totalCount = 0;

    for (const account of accounts) {
      const result = await createAccountSchedules(account.id);
      totalCount += result.count;
    }

    return { success: true, count: totalCount };
  } catch (error) {
    console.error('Failed to create all account schedules:', error);
    throw error;
  }
};
