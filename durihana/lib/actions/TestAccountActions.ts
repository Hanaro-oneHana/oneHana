'use server';

import prisma from '../db';
import { createAccountSchedules } from './AccountCalendarActions';

// 테스트용 계좌 생성 함수 (수정됨)
export const createTestAccount = async (
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
      balance: BigInt(Math.floor(Math.random() * 50000000) + 1000000), // 100만원 ~ 5000만원
      type: accountType,
      user_id: userId,
    };

    // 계좌 타입별 설정
    switch (accountType) {
      case 0: // 입출금
        // 입출금은 만료일, 이체일 없음
        break;
      case 1: // 예금
        accountData.expire_date =
          expireDate.toISOString().split('T')[0] + ' 10:00:00';
        break;
      case 2: // 적금
        accountData.expire_date =
          expireDate.toISOString().split('T')[0] + ' 10:00:00';
        accountData.transfer_date = String(transferDay); // 선택한 날짜
        accountData.payment = BigInt(500000); // 50만원 납입
        break;
      case 3: // 대출
        accountData.expire_date =
          expireDate.toISOString().split('T')[0] + ' 10:00:00';
        accountData.transfer_date = String(transferDay); // 선택한 날짜
        accountData.payment = BigInt(300000); // 30만원 상환
        break;
    }

    // 계좌 생성
    const account = await prisma.account.create({
      data: accountData,
    });

    console.log('🚀 ~ Created test account:', account);

    // UserCalendar에 관련 일정들 자동 생성
    const scheduleResult = await createAccountSchedules(account.id);

    return {
      success: true,
      account,
      schedulesCreated: scheduleResult.count,
    };
  } catch (error) {
    console.error('Failed to create test account:', error);
    throw error;
  }
};

// 테스트 계좌들 삭제 함수
export const deleteTestAccounts = async (userId: number) => {
  try {
    // 해당 사용자의 모든 계좌 삭제
    const deletedAccounts = await prisma.account.deleteMany({
      where: {
        user_id: userId,
      },
    });

    // 해당 사용자의 모든 UserCalendar 일정 삭제
    const deletedSchedules = await prisma.usercalendar.deleteMany({
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
    console.error('Failed to delete test accounts:', error);
    throw error;
  }
};
