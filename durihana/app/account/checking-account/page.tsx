'use client';

import {
  AccountAgreement,
  CheckingAccountAgreement,
} from '@/components/account';
import AlertModal from '@/components/alert/AlertModal';
import { Button, Header, Txt } from '@/components/atoms';
import Container from '@/components/containers/Container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { createOneAccount } from '@/lib/actions/AccountActions';

export default function CheckingAccount() {
  const [agree, setAgree] = useState(false);
  const [modal, showModal] = useState(false);
  const { data: session } = useSession();
  const rawId = session?.user?.id as number | undefined;
  const userId = Number(rawId);
  const router = useRouter();

  const handleNext = async () => {
    if (!agree) {
      showModal(true);
      return;
    }
    if (!userId) {
      // 로그인 안된 경우
      return router.push('/auth/signin');
    }
    await createOneAccount(userId);
    // 2) 다음 단계(견적)로 이동
    router.push('/estimate');
  };

  return (
    <Container
      className='pt-[77px] pb-[88px]'
      header={<Header leftIcon='back' title='계좌개설' />}
      footer={
        <div className='bg-background flex px-[20px] pb-[40px]'>
          <Button onClick={handleNext}>다음</Button>
        </div>
      }
    >
      <div className='flex w-full flex-col'>
        <div className='flex'>
          <Txt>약관동의</Txt>
        </div>
        <Accordion type='multiple'>
          <div>
            <AccordionItem value='item-1'>
              <AccordionTrigger className='border-primarycolor border-b'>
                <Txt className='text-[14px]'>비대면 계좌 개설 약관 동의서</Txt>
              </AccordionTrigger>
              <AccordionContent className='flex flex-col gap-4 pt-[16px]'>
                <AccountAgreement />
              </AccordionContent>
            </AccordionItem>
          </div>

          <div>
            <AccordionItem value='item-2'>
              <AccordionTrigger className='border-primarycolor border-b'>
                <Txt className='text-[14px]'>입출금 상품 약관 동의서</Txt>
              </AccordionTrigger>
              <AccordionContent className='flex flex-col gap-4 pt-[16px]'>
                <CheckingAccountAgreement />
              </AccordionContent>
            </AccordionItem>
          </div>
        </Accordion>
        <div className='flex items-center justify-end pr-[10px]'>
          <span className='m-2 text-[10px]'>
            이에 대한 내용을 모두 확인했습니다
          </span>
          <Checkbox
            id='agree'
            className='data-[state=checked]:bg-mainwhite'
            onCheckedChange={(checked) => {
              setAgree(!!checked);
            }}
          />
        </div>
      </div>

      {modal && (
        <AlertModal onClose={() => showModal(false)}>
          <Txt align='text-center' size='text-[16px]' weight='font-[600]'>
            약관에 동의해야 <br />
            서비스를 이용하실 수 있습니다
          </Txt>
          <Button className='mt-5 py-[10px]' onClick={() => showModal(false)}>
            확인
          </Button>
        </AlertModal>
      )}
    </Container>
  );
}
