'use client';

import {
  AccountAgreement,
  DepositAgreement,
  LoanAgreement,
  SavingsAgreement,
} from '@/components/account';
import AlertModal from '@/components/alert/AlertModal';
import { InputComponent, Button, Txt, Header } from '@/components/atoms';
import Container from '@/components/containers/Container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useAgreement } from '@/contexts/account/useAgreement';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { plusBalanceBySessionUser } from '@/lib/actions/calBalance';

export default function ElseAccount() {
  const {
    baseAgree,
    setBaseAgree,
    depositAgree,
    setDepositAgree,
    savingsAgree,
    setSavingsAgree,
    loanAgree,
    setLoanAgree,
  } = useAgreement();

  const [modal, showModal] = useState(false);
  const router = useRouter();
  const [initialDeposit, setInitialDeposit] = useState('');

  const btnClick = async () => {
    const amount = Number(initialDeposit.replace(/,/g, ''));
    await plusBalanceBySessionUser(amount);
  };

  return (
    <Container
      className='pt-[77px] pb-[88px]'
      header={<Header leftIcon='back' title='계좌개설' />}
      footer={
        <div className='bg-background flex gap-2 px-[20px] pb-[40px]'>
          <Button
            bgColor='bg-icon'
            onClick={() => {
              btnClick();
              router.push('/');
            }}
            className='w-1/2'
          >
            홈으로
          </Button>
          <Button
            onClick={() => {
              if (!baseAgree) {
                showModal(true);
                return;
              }

              const types: number[] = [];
              if (depositAgree) types.push(1); // 예금
              if (savingsAgree) types.push(2); // 적금
              if (loanAgree) types.push(3); // 대출

              btnClick();

              router.push(`./create-account?types=${types.join(',')}`);
            }}
            className='w-1/2'
          >
            다음
          </Button>
        </div>
      }
    >
      <div className='flex w-full flex-col'>
        <Txt>입출금통장 초기 입금액</Txt>
        <InputComponent
          placeholder='입금할 금액을 입력하세요'
          value={initialDeposit}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남김
            const formatted = raw ? Number(raw).toLocaleString() : '';
            setInitialDeposit(formatted);
          }}
          inputMode='numeric'
          className='text-[14px]'
        />
        <div>
          <Txt size='text-[12px]' color='text-red'>
            {"상품 가입을 원하지 않는 경우, '홈으로' 버튼을 눌러주세요."}
          </Txt>
        </div>
      </div>

      <div className='flex pt-[40px]'>
        <Txt>약관동의</Txt>
      </div>
      <div className='w-full'>
        <Accordion type='multiple'>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='border-primarycolor border-b'>
              <Txt className='text-[14px]'>
                비대면 계좌 개설 가입 동의서
                <Txt className='ml-1 text-[8px]' color='text-red'>
                  (필수)
                </Txt>
              </Txt>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 pt-[16px]'>
              <AccountAgreement />
              <div className='flex items-center justify-end pr-[25px]'>
                <span className='m-2 text-[10px]'>
                  이에 대한 내용을 모두 확인했습니다
                </span>
                <Checkbox
                  id='baseAgree'
                  checked={baseAgree}
                  className='data-[state=checked]:bg-mainwhite'
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                      setBaseAgree(checked);
                    }
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='item-2'>
            <AccordionTrigger className='border-primarycolor border-b'>
              <Txt className='text-[14px]'>
                정기예금 상품 가입 동의서
                <Txt className='ml-1 text-[8px]' color='text-red'>
                  (선택)
                </Txt>
              </Txt>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 pt-[16px]'>
              <DepositAgreement />
              <div className='flex items-center justify-end pr-[25px]'>
                <span className='m-2 text-[10px]'>
                  이에 대한 내용을 모두 확인했습니다
                </span>
                <Checkbox
                  id='depositAgree'
                  checked={depositAgree}
                  className='data-[state=checked]:bg-mainwhite'
                  onCheckedChange={(checked) => {
                    setDepositAgree(!!checked);
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='item-3'>
            <AccordionTrigger className='border-primarycolor border-b'>
              <Txt className='text-[14px]'>
                정기적금 가입 동의서
                <Txt className='ml-1 text-[8px]' color='text-red'>
                  (선택)
                </Txt>
              </Txt>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 pt-[16px]'>
              <SavingsAgreement />
              <div className='flex items-center justify-end pr-[25px]'>
                <span className='m-2 text-[10px]'>
                  이에 대한 내용을 모두 확인했습니다
                </span>
                <Checkbox
                  id='savingsAgree'
                  checked={savingsAgree}
                  className='data-[state=checked]:bg-mainwhite'
                  onCheckedChange={(checked) => {
                    setSavingsAgree(!!checked);
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='item-4'>
            <AccordionTrigger className='border-primarycolor border-b'>
              <Txt className='text-[14px]'>
                대출 상품 가입 동의서
                <Txt className='ml-1 text-[8px]' color='text-red'>
                  (선택)
                </Txt>
              </Txt>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 pt-[16px]'>
              <LoanAgreement />
              <div className='flex items-center justify-end pr-[25px]'>
                <span className='m-2 text-[10px]'>
                  이에 대한 내용을 모두 확인했습니다
                </span>
                <Checkbox
                  id='loanAgree'
                  checked={loanAgree}
                  className='data-[state=checked]:bg-mainwhite'
                  onCheckedChange={(checked) => {
                    setLoanAgree(!!checked);
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {modal && (
        <AlertModal onClose={() => showModal(false)}>
          <Txt align='text-center'>
            비대면 계좌 개설 약관에 동의하셔야
            <br />
            서비스를 이용하실 수 있습니다
          </Txt>
          <Button className='mt-5' onClick={() => showModal(false)}>
            확인
          </Button>
        </AlertModal>
      )}
    </Container>
  );
}
