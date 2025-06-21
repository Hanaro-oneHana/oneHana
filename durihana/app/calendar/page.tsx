// app/calendar/page.tsx
'use client';

import { BottomNavigation, Header } from '@/components/atoms';
import UserCalendar from '@/components/schedule/UserCalendar';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { processTodayTransfers } from '@/lib/actions/ScheduleProcessingActions';

// app/calendar/page.tsx

export default function Calendar() {
  const { data: session, status } = useSession();
  const userId = Number(session?.user?.id);

  // 오늘의 입출금 출금/입금 처리
  useEffect(() => {
    if (status === 'authenticated') {
      processTodayTransfers(userId).catch(console.error);
    }
  }, [status, userId]);

  if (status === 'loading') return <p>로딩 중...</p>;
  if (!session?.user?.id) return <p>로그인이 필요합니다.</p>;

  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <UserCalendar userId={userId} />
      <BottomNavigation selectedItem='calendar' />
    </>
  );
}
