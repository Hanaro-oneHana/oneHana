'use server';

import prisma from '../db';

// 사용자의 개인 금융 계획 가져오기 (usercalendar)
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

// 사용자의 예약 일정 가져오기 (partnercalendar)
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

// 특정 날짜의 사용자 일정들 가져오기
export const getUserSchedulesForDate = async (userId: number, date: string) => {
  console.log('🚀 ~ getUserSchedulesForDate ~ userId:', userId);
  console.log('🚀 ~ getUserSchedulesForDate ~ date:', date);

  const [financePlans, reservations] = await Promise.all([
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
  ]);

  console.log('🚀 ~ financePlans:', financePlans);
  console.log('🚀 ~ reservations:', reservations);

  return {
    financePlans,
    reservations,
  };
};

// 금융 일정이 있는 날짜들 가져오기
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

// 예약 일정이 있는 날짜들 가져오기
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
