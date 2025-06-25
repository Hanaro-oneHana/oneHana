import { Header } from '@/components/atoms';
import InviteCode from '@/components/auth/InviteCode';

export default function InviteCodePage() {
  return (
    <>
      <Header leftIcon='back' title='초대코드 입력' />
      <InviteCode />
    </>
  );
}
