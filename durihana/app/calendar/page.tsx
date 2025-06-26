'use client';

import { BottomNavigation, Header } from '@/components/atoms';
import Container from '@/components/containers/Container';
import { UserCalendar } from '@/components/schedule/index';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { processTodayTransfers } from '@/lib/actions/ScheduleProcessingActions';

export default function Calendar() {
  const { data: session, status } = useSession();
  const userId = Number(session?.user?.id);

  useEffect(() => {
    if (status === 'authenticated') {
      processTodayTransfers(userId);
    }
  }, [status, userId]);

  if (status === 'loading') return <p>로딩 중...</p>;
  if (!session?.user?.id) return <p>로그인이 필요합니다.</p>;

  return (
    <Container
      header={<Header leftIcon='my' rightIcon='bell' />}
      footer={<BottomNavigation selectedItem='calendar' />}
    >
      <UserCalendar userId={userId} />
    </Container>
  );
}
