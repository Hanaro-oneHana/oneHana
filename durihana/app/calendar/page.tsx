'use client';

import { BottomNavigation, Header } from '@/components/atoms';
import UserCalendar from '@/components/schedule/UserCalendar';
import { useSession } from 'next-auth/react';

export default function Calendar() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>로딩 중...</p>;
  }
  if (!session?.user?.id) {
    return <p>로그인이 필요합니다.</p>;
  }
  const userId = Number(session.user.id);

  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />

      <UserCalendar userId={userId} />
      <BottomNavigation selectedItem='calendar' />
    </>
  );
}
