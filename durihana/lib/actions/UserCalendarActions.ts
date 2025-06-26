'use server';

import prisma from '../db';

// 특정 날짜의 사용자 일정들 가져오기
export const getUserSchedulesForDate = async (
  userId: number,
  mainId: number,
  date: string
) => {
  const [financePlans, reservations, userAccounts] = await Promise.all([
    // 개인 금융 계획
    prisma.userCalendar.findMany({
      where: {
        user_id: userId,
        user_date: {
          startsWith: date, // '2025-01-15'
        },
      },
    }),
    // 예약 일정
    prisma.partnerCalendar.findMany({
      where: {
        user_id: mainId,
        reservation_date: {
          startsWith: date, // '2025-01-15'
        },
      },
      include: {
        PartnerService: {
          select: {
            id: true,
            name: true,
            Partner: {
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

  return await prisma.userCalendar.findMany({
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

  return await prisma.partnerCalendar.findMany({
    where: {
      user_id: userId,
      reservation_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      PartnerService: {
        select: {
          id: true,
          name: true,
          Partner: {
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

  const financeDates = await prisma.userCalendar.findMany({
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

  const reservationDates = await prisma.partnerCalendar.findMany({
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
