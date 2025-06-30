import { CreateAccount } from '@/components/account';
import { Txt } from '@/components/atoms';
import Container from '@/components/containers/Container';
import { Suspense } from 'react';

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<Txt>로딩중...</Txt>}>
      <CreateAccount />
    </Suspense>
  );
}
