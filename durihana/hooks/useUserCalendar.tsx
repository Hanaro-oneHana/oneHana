'use client';

import { getScheduleTitle, Schedule } from '@/types/Schedule';
import { useState, useEffect } from 'react';
import {
  getDepositInterestRate,
  // ◀ 추가된 부분
  getSavingsInterestRate,
  // ◀ 추가된 부분
  getLoanInterestRate, // ◀ 추가된 부분
} from '@/lib/actions/InterestActions';
import {
  getUserSchedulesForDate,
  getFinanceScheduleDates,
  getReservationScheduleDates,
} from '@/lib/actions/UserCalendarActions';
import { formatDate } from '@/lib/utils';

export function useUserCalendar(userId: number) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [financeScheduleDates, setFinanceScheduleDates] = useState<Date[]>([]);
  const [reservationScheduleDates, setReservationScheduleDates] = useState<
    Date[]
  >([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  // 달력에 점 표시할 날짜들 로드
  useEffect(() => {
    (async () => {
      const financeDates = await getFinanceScheduleDates(
        userId,
        calendarYear,
        calendarMonth
      );
      const reservationDates = await getReservationScheduleDates(
        userId,
        calendarYear,
        calendarMonth
      );
      setFinanceScheduleDates(financeDates);
      setReservationScheduleDates(reservationDates);
    })();
  }, [userId, calendarYear, calendarMonth]);

  // 선택된 날짜의 상세 일정 로드
  useEffect(() => {
    async function loadSchedules() {
      setLoading(true);
      const dateStr = formatDate(selectedDate);
      const { financePlans, userAccounts, reservations } =
        await getUserSchedulesForDate(userId, dateStr);

      // ◀ 추가된 부분: 현재 사용자에 대한 이자율을 함께 불러옴
      const depositRate = await getDepositInterestRate(userId);
      const savingsRate = await getSavingsInterestRate(userId);
      const loanRate = await getLoanInterestRate(userId);

      const formatted: Schedule[] = [];

      financePlans.forEach((plan) => {
        const [datePart, timePart = '00:00'] = plan.user_date.split(' ');
        const [y, m, d] = datePart.split('-').map(Number);
        const localDate = new Date(y, m - 1, d);

        // 원금 또는 상환액
        const account = userAccounts.find((acc) => acc.type === plan.type);
        let amount = 0;
        if (account) {
          if (plan.type === 3)
            amount = Number(account.payment || 0); // 대출 상환액
          else amount = Number(account.balance || 0); // 예금/적금 잔액
        }

        // ◀ 추가된 부분: 타입별 이자율 선택
        let rate = 0;
        if (plan.type === 1)
          rate = depositRate; // 예금
        else if (plan.type === 2)
          rate = savingsRate; // 적금
        else rate = loanRate; // 대출

        // ◀ 추가된 부분: 이자액 계산
        const interestAmount = Math.round(amount * (rate / 100));

        formatted.push({
          id: plan.id,
          title: getScheduleTitle(
            plan.type,
            plan.type === 1 || plan.type === 3
          ),
          date: localDate,
          time: timePart,
          type: 'finance',
          accountType: plan.type,
          amount: interestAmount, // ◀ 추가된 부분: 이자 금액으로 표시
        });
      });

      // 예약 일정 변환 (기존 로직)
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

      // 시간순 정렬 & 상태 업데이트
      formatted.sort((a, b) => a.time.localeCompare(b.time));
      setSchedules(formatted);
      setLoading(false);
    }
    loadSchedules();
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
