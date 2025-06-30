'use client';

import { getScheduleTitle, Schedule } from '@/types/Schedule';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
  getDepositInterestRate,
  getSavingsInterestRate,
} from '@/lib/actions/InterestActions';
import {
  getUserSchedulesForDate,
  getFinanceScheduleDates,
  getReservationScheduleDates,
} from '@/lib/actions/UserCalendarActions';
import { formatDate } from '@/lib/utils';

export function useUserCalendar(userId: number) {
  const { data: session } = useSession();
  const mainId = session?.user?.isMain
    ? Number(session.user.id)
    : (session?.user?.partnerId ?? 0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [financeScheduleDates, setFinanceScheduleDates] = useState<Date[]>([]);
  const [reservationScheduleDates, setReservationScheduleDates] = useState<
    Date[]
  >([]);
  const [calendarMonth, setCalendarMonth] = useState<number>(
    new Date().getMonth()
  );
  const [calendarYear, setCalendarYear] = useState<number>(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState<boolean>(false);

  // 달력 점 표시용 날짜들 불러오기
  useEffect(() => {
    (async () => {
      const fd = await getFinanceScheduleDates(
        userId,
        calendarYear,
        calendarMonth
      );
      const rd = await getReservationScheduleDates(
        mainId,
        calendarYear,
        calendarMonth
      );
      setFinanceScheduleDates(fd);
      setReservationScheduleDates(rd);
    })();
  }, [userId, calendarYear, calendarMonth]);

  // 선택된 날짜의 일정 로드
  useEffect(() => {
    (async () => {
      setLoading(true);
      const dateStr = formatDate(selectedDate);
      const { financePlans, userAccounts, reservations, savingsDay } =
        await getUserSchedulesForDate(userId, mainId, dateStr);

      // 동적 예금 이자율(1년 기준)
      const depositRate = await getDepositInterestRate(userId);
      const savingsRate = await getSavingsInterestRate(userId);

      const formatted: Schedule[] = [];

      financePlans.forEach((plan) => {
        const [datePart, timePart = '00:00'] = plan.user_date.split(' ');
        const [y, m, d] = datePart.split('-').map(Number);
        const localDate = new Date(y, m - 1, d);
        const account = userAccounts.find((acc) => acc.type === plan.type);
        const isExpiry = datePart === account?.expire_date;

        if (plan.type === 1) {
          // 예금: 만기일에만 원금 + 이자
          if (isExpiry) {
            const principal = Number(account?.balance ?? 0);
            const interest = Math.round(principal * (depositRate / 100));
            formatted.push({
              id: plan.id,
              title: getScheduleTitle(1, true), // '예금 만료'
              date: localDate,
              time: timePart,
              type: 'finance',
              accountType: 1,
              amount: principal + interest,
            });
          }
        } else if (plan.type === 2) {
          // 적금: 매월 납입, 마지막에는 원금+이자
          const payment = Number(account?.payment ?? 0);
          if (!isExpiry) {
            formatted.push({
              id: plan.id,
              title: getScheduleTitle(2, false), // '적금 납입'
              date: localDate,
              time: timePart,
              type: 'finance',
              accountType: 2,
              amount: payment,
            });
          } else {
            const monthly = Number(account?.payment ?? 0);
            const totalSteps = savingsDay;
            console.log('🚀 ~ financePlans.forEach ~ totalSteps:', totalSteps);
            const principal = monthly * totalSteps; // ← 현재 balance 대신
            const interest = Math.round(principal * (savingsRate / 100));
            formatted.push({
              id: plan.id,
              title: getScheduleTitle(2, true), // '적금 만료'
              date: localDate,
              time: timePart,
              type: 'finance',
              accountType: 2,
              amount: principal + interest,
            });
          }
        } else if (plan.type === 3) {
          // 대출: 매월 상환, 마지막에는 '대출 만료'에 0원(-0)
          const payment = Number(account?.payment ?? 0);
          formatted.push({
            id: plan.id,
            title: isExpiry ? '대출 만료' : getScheduleTitle(3, false), // '대출 상환'
            date: localDate,
            time: timePart,
            type: 'finance',
            accountType: 3,
            amount: isExpiry ? 0 : payment,
          });
        }
      });

      // 예약 일정
      reservations.forEach((res) => {
        const [datePart, timePart = '00:00'] = res.reservation_date.split(' ');
        const [y, m, d] = datePart.split('-').map(Number);
        formatted.push({
          id: res.id,
          title: res.PartnerService.name,
          date: new Date(y, m - 1, d),
          time: timePart,
          type: 'reservation',
          partnerName: res.PartnerService.Partner.name,
        });
      });

      // 시간순 정렬
      formatted.sort((a, b) => a.time.localeCompare(b.time));
      setSchedules(formatted);
      setLoading(false);
    })();
  }, [selectedDate, userId]);

  return {
    selectedDate,
    setSelectedDate,
    calendarMonth,
    setCalendarMonth,
    calendarYear,
    setCalendarYear,
    loading,
    reservationSchedules: schedules.filter((s) => s.type === 'reservation'),
    financeSchedules: schedules.filter((s) => s.type === 'finance'),
    financeScheduleDates,
    reservationScheduleDates,
  };
}
