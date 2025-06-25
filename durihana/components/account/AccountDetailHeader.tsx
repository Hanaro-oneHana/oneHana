'use client';

import Header from '@/components/atoms/Header';
import { useRouter } from 'next/navigation';

export default function AccountDetailHeader() {
  const router = useRouter();

  return (
    <Header
      leftIcon='back'
      rightIcon='close'
      title='내역'
      onLeftClick={() => router.push('/')}
      onRightClick={() => router.push('/')}
    />
  );
}
