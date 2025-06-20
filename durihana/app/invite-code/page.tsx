import InviteCode from '@/components/InviteCode';
import { Header } from '@/components/atoms';

export default function InviteCodePage() {
  return (
    <>
      <Header leftIcon='back' title='초대코드 입력' />
      <InviteCode />
    </>
  );
}
