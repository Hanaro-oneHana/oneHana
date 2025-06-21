// hooks/useUserCalendar.tsx
'use client';

import { getScheduleTitle, Schedule } from '@/types/Schedule';
import { useState, useEffect } from 'react';
import {
  getDepositInterestRates,
  getSavingsInterestRates,
} from '@/lib/actions/InterestActions';
import {
  getUserSchedulesForDate,
  getFinanceScheduleDates,
  getReservationScheduleDates,
} from '@/lib/actions/UserCalendarActions';
import { formatDate } from '@/lib/utils';

// hooks/useUserCalendar.tsx

// hooks/useUserCalendar.tsx

// hooks/useUserCalendar.tsx

// hooks/useUserCalendar.tsx

export function useUserCalendar(userId: number) {
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

  // ◀ Deposit/Savings 이자율 테이블 (step별)
  const [depositRates, setDepositRates] = useState<
    { step: number; rate: number }[]
  >([]);
  const [savingsRates, setSavingsRates] = useState<
    { step: number; rate: number }[]
  >([]);

  // 1. 한번만 테이블 전체 로드
  useEffect(() => {
    (async () => {
      setDepositRates(await getDepositInterestRates());
      setSavingsRates(await getSavingsInterestRates());
    })();
  }, []);

  // 2. 달력에 점 표시할 날짜들 로드
  useEffect(() => {
    (async () => {
      const fd = await getFinanceScheduleDates(
        userId,
        calendarYear,
        calendarMonth
      );
      const rd = await getReservationScheduleDates(
        userId,
        calendarYear,
        calendarMonth
      );
      setFinanceScheduleDates(fd);
      setReservationScheduleDates(rd);
    })();
  }, [userId, calendarYear, calendarMonth]);

  // 3. 선택일 변경 시 상세 스케줄 로드
  useEffect(() => {
    (async () => {
      setLoading(true);
      const dateStr = formatDate(selectedDate);
      const { financePlans, userAccounts, reservations } =
        await getUserSchedulesForDate(userId, dateStr);

      const formatted: Schedule[] = [];

      financePlans.forEach((plan, idx) => {
        // 날짜/시간 분리
        const [datePart, timePart = '00:00'] = plan.user_date.split(' ');
        const [y, m, d] = datePart.split('-').map(Number);
        const localDate = new Date(y, m - 1, d);

        // 해당 계좌 정보
        const account = userAccounts.find((acc) => acc.type === plan.type);

        if (plan.type === 3) {
          // ◀ 대출: DB에서 이미 계산된 payment(원리금 균등상환액) 사용
          const amt = account?.payment ? Number(account.payment) : 0;
          formatted.push({
            id: plan.id,
            title: getScheduleTitle(plan.type, false),
            date: localDate,
            time: timePart,
            type: 'finance',
            accountType: plan.type,
            amount: amt,
          });
        } else {
          // ◀ 예금(type=1) & 적금(type=2): step별 이자 계산
          const baseAmount =
            plan.type === 1
              ? Number(account?.balance ?? 0) // 예금: 잔액
              : Number(account?.payment ?? 0); // 적금: 한 회 납입액

          const step = idx + 1; // 첫 일정부터 단계 1,2,…
          const rateEntry =
            plan.type === 1
              ? depositRates.find((r) => r.step === step)
              : savingsRates.find((r) => r.step === step);
          const rate = rateEntry?.rate ?? 0;
          const interestAmount = Math.round(baseAmount * (rate / 100));

          formatted.push({
            id: plan.id,
            title: getScheduleTitle(plan.type, plan.type === 1),
            date: localDate,
            time: timePart,
            type: 'finance',
            accountType: plan.type,
            amount: interestAmount,
          });
        }
      });

      // 예약 일정 변환 (변경 없음)
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
  }, [selectedDate, userId, depositRates, savingsRates]);

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
