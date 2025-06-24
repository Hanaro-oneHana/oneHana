import CreateAccount from '@/components/account/CreateAccount';
import { Txt } from '@/components/atoms';
import { Suspense } from 'react';

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<Txt>로딩중...</Txt>}>
      <CreateAccount />
    </Suspense>
  );
}
