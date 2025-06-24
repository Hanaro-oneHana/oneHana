'use server';

import prisma from '../db';
import { TIMES } from '../times';

// 특정 날짜의 예약된 시간들을 가져오는 함수
export const getReservedTimes = async (
  partnerServiceId: number,
  date: string
) => {
  console.log('🚀 ~ partnerServiceId:', partnerServiceId);
  console.log('🚀 ^^^^^^^^^^^^^^^^^date:', date);
  const reservations = await prisma.partnerCalendar.findMany({
    where: {
      partner_service_id: partnerServiceId,
      reservation_date: {
        startsWith: date, // '2025-01-15'
      },
    },
    select: {
      reservation_date: true,
    },
  });
  console.log('🚀 여기여기여기여기 reservations:', reservations);

  // reservation_date에서 시간 부분만 추출 (예: '2025-01-15 10:00' -> '10:00')
  return reservations
    .map((reservation) => {
      const timePart = reservation.reservation_date.split(' ')[1];
      return timePart;
    })
    .filter(Boolean);
};

// 전체 시간이 예약된 날짜들을 가져오는 함수
export const getFullyBookedDates = async (
  partnerServiceId: number,
  year: number,
  month: number
) => {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

  const reservations = await prisma.partnerCalendar.findMany({
    where: {
      partner_service_id: partnerServiceId,
      reservation_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      reservation_date: true,
    },
  });
  console.log('🚀 ~ reservations:', reservations);

  // 날짜별로 예약된 시간 개수 계산
  const dateTimeCount: { [key: string]: number } = {};

  reservations.forEach((reservation) => {
    const datePart = reservation.reservation_date.split(' ')[0];
    dateTimeCount[datePart] = (dateTimeCount[datePart] || 0) + 1;
  });

  // 모든 시간대가 예약된 날짜들만 반환
  const fullyBookedDates: Date[] = [];
  Object.entries(dateTimeCount).forEach(([dateStr, count]) => {
    if (count >= TIMES.length) {
      fullyBookedDates.push(new Date(dateStr));
    }
  });

  return fullyBookedDates;
};

export const addPartnerCalendarEvent = async (
  userId: number,
  partnerServiceId: number,
  date: string,
  time: string
): Promise<void> => {
  // 날짜를 YYYY-MM-DD HH:mm 포맷으로 생성
  const reservationDate = `${date} ${time}`;
  await prisma.partnerCalendar.create({
    data: {
      user_id: userId,
      partner_service_id: partnerServiceId,
      reservation_date: reservationDate,
    },
  });
};
