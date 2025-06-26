import { Header } from '@/components/atoms';
import InviteCode from '@/components/auth/InviteCode';
import Container from '@/components/containers/Container';

export default function InviteCodePage() {
  return (
    <>
     
      <Container 
      className='flex flex-col items-center h-dvh pt-[120px]'
      header = { <Header leftIcon='back' title='초대코드 입력' />}
      >
        <InviteCode />
      </Container>
      
    </>
  );
}

