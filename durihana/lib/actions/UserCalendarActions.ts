'use server';

import prisma from '../db';

// 사용자의 개인 일정 가져오기 (usercalendar)
export const getUserSchedules = async (
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
    include: {
      partnerservice: {
        include: {
          partner: true,
        },
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
        include: {
          partner: true,
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

  const [personalSchedules, reservations] = await Promise.all([
    // 개인 일정
    prisma.usercalendar.findMany({
      where: {
        user_id: userId,
        user_date: {
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
                // discount_rate는 Decimal이므로 제외하거나 변환 필요
              },
            },
          },
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
                // discount_rate는 Decimal이므로 제외하거나 변환 필요
              },
            },
          },
        },
      },
    }),
  ]);

  console.log('🚀 ~ personalSchedules:', personalSchedules);
  console.log('🚀 ~ reservations:', reservations);

  // Decimal 필드가 있다면 변환
  const processedPersonalSchedules = personalSchedules.map((schedule) => ({
    ...schedule,
    partnerservice: {
      ...schedule.partnerservice,
      partner: {
        ...schedule.partnerservice.partner,
        // discount_rate가 필요하다면 여기서 변환
        // discount_rate: schedule.partnerservice.partner.discount_rate?.toNumber() || 0,
      },
    },
  }));

  const processedReservations = reservations.map((reservation) => ({
    ...reservation,
    partnerservice: {
      ...reservation.partnerservice,
      partner: {
        ...reservation.partnerservice.partner,
        // discount_rate가 필요하다면 여기서 변환
        // discount_rate: reservation.partnerservice.partner.discount_rate?.toNumber() || 0,
      },
    },
  }));

  return {
    personalSchedules: processedPersonalSchedules,
    reservations: processedReservations,
  };
};

// 일정이 있는 날짜들 가져오기 (달력에 점 표시용)
export const getScheduleDates = async (
  userId: number,
  year: number,
  month: number
) => {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

  console.log('🚀 ~ getScheduleDates ~ userId:', userId);
  console.log('🚀 ~ getScheduleDates ~ startDate:', startDate);
  console.log('🚀 ~ getScheduleDates ~ endDate:', endDate);

  const [personalDates, reservationDates] = await Promise.all([
    // 개인 일정 날짜들
    prisma.usercalendar.findMany({
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
    }),
    // 예약 일정 날짜들
    prisma.partnercalendar.findMany({
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
    }),
  ]);

  console.log('🚀 ~ personalDates:', personalDates);
  console.log('🚀 ~ reservationDates:', reservationDates);

  // 날짜 문자열에서 날짜 부분만 추출하고 중복 제거
  const allDates = new Set<string>();

  personalDates.forEach((item) => {
    const datePart = item.user_date.split(' ')[0]; // '2025-01-15 10:00' -> '2025-01-15'
    allDates.add(datePart);
  });

  reservationDates.forEach((item) => {
    const datePart = item.reservation_date.split(' ')[0]; // '2025-01-15 10:00' -> '2025-01-15'
    allDates.add(datePart);
  });

  console.log('🚀 ~ allDates:', Array.from(allDates));

  // Date 객체 배열로 변환 (시간대 문제 해결)
  return Array.from(allDates).map((dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
};
