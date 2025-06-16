'use server';

import prisma from '../db';

// 특정 날짜의 사용자 일정들 가져오기
export const getUserSchedulesForDate = async (userId: number, date: string) => {
  console.log('🚀 ~ getUserSchedulesForDate ~ userId:', userId);
  console.log('🚀 ~ getUserSchedulesForDate ~ date:', date);

  const [financePlans, reservations, userAccounts] = await Promise.all([
    // 개인 금융 계획
    prisma.usercalendar.findMany({
      where: {
        user_id: userId,
        user_date: {
          startsWith: date, // '2025-01-15'
        },
      },
    }),
    // 예약 일정
    prisma.partnercalendar.findMany({
      where: {
        user_id: userId,
        reservation_date: {
          startsWith: date, // '2025-01-15'
        },
      },
      include: {
        partnerservice: {
          select: {
            id: true,
            name: true,
            partner: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                address: true,
                service_detail: true,
                is_active: true,
              },
            },
          },
        },
      },
    }),
    // 해당 사용자의 모든 계좌 정보 (타입별로 매칭하기 위해)
    prisma.account.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        type: true,
        payment: true,
        balance: true,
        expire_date: true,
        transfer_date: true,
      },
    }),
  ]);

  console.log('🚀 ~ financePlans:', financePlans);
  console.log('🚀 ~ userAccounts:', userAccounts);
  console.log('🚀 ~ reservations:', reservations);

  return {
    financePlans,
    userAccounts,
    reservations,
  };
};

// 나머지 함수들은 동일...
export const getUserFinancePlans = async (
  userId: number,
  year: number,
  month: number
) => {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

  return await prisma.usercalendar.findMany({
    where: {
      user_id: userId,
      user_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      user_date: 'asc',
    },
  });
};

export const getUserReservations = async (
  userId: number,
  year: number,
  month: number
) => {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

  return await prisma.partnercalendar.findMany({
    where: {
      user_id: userId,
      reservation_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      partnerservice: {
        select: {
          id: true,
          name: true,
          partner: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              address: true,
              service_detail: true,
              is_active: true,
            },
          },
        },
      },
    },
    orderBy: {
      reservation_date: 'asc',
    },
  });
};

export const getFinanceScheduleDates = async (
  userId: number,
  year: number,
  month: number
) => {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

  console.log('🚀 ~ getFinanceScheduleDates ~ userId:', userId);
  console.log('🚀 ~ getFinanceScheduleDates ~ startDate:', startDate);
  console.log('🚀 ~ getFinanceScheduleDates ~ endDate:', endDate);

  const financeDates = await prisma.usercalendar.findMany({
    where: {
      user_id: userId,
      user_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      user_date: true,
    },
  });

  console.log('🚀 ~ financeDates:', financeDates);

  const allDates = new Set<string>();
  financeDates.forEach((item) => {
    const datePart = item.user_date.split(' ')[0];
    allDates.add(datePart);
  });

  return Array.from(allDates).map((dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
};

export const getReservationScheduleDates = async (
  userId: number,
  year: number,
  month: number
) => {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

  console.log('🚀 ~ getReservationScheduleDates ~ userId:', userId);
  console.log('🚀 ~ getReservationScheduleDates ~ startDate:', startDate);
  console.log('🚀 ~ getReservationScheduleDates ~ endDate:', endDate);

  const reservationDates = await prisma.partnercalendar.findMany({
    where: {
      user_id: userId,
      reservation_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      reservation_date: true,
    },
  });

  console.log('🚀 ~ reservationDates:', reservationDates);

  const allDates = new Set<string>();
  reservationDates.forEach((item) => {
    const datePart = item.reservation_date.split(' ')[0];
    allDates.add(datePart);
  });

  return Array.from(allDates).map((dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
};
