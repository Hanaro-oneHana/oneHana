'use client';

import AlertModal from '@/components/alert/AlertModal';
import AccountAgreement from '@/components/atoms/AccountAgreement';
import Button from '@/components/atoms/Button';
import DepositAgreement from '@/components/atoms/DepositAgreement';
import Header from '@/components/atoms/Header';
import LoanAgreement from '@/components/atoms/LoanAgreement';
import SavingsAgreement from '@/components/atoms/SavingsAgreement';
import Txt from '@/components/atoms/Txt';
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

  return (
    <div className='relative flex flex-col shrink-0 w-full items-center justify-between h-dvh overflow-hidden'>
      <div className='flex flex-col items-center h-full w-full overflow-y-scroll '>
        <Header leftIcon='back' title='계좌개설' />
        <div className='flex flex-col pl-[25px] pr-[25px]'>
          <div className='flex pt-[40px] '>
            <Txt>약관동의</Txt>
          </div>
          <Accordion type='multiple'>
            <div className='w-[325px]'>
              <AccordionItem value='item-1'>
                <AccordionTrigger className='border-b border-primarycolor'>
                  <Txt className='text-[14px]'>
                    비대면 계좌 개설 약관 동의서
                    <Txt className='text-[8px] ml-1' color='text-red'>
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
                <AccordionTrigger className='border-b border-primarycolor'>
                  <Txt className='text-[14px]'>
                    정기예금 상품 약관 동의서
                    <Txt className='text-[8px] ml-1' color='text-red'>
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
                <AccordionTrigger className='border-b border-primarycolor'>
                  <Txt className='text-[14px]'>
                    정기적금 약관 동의서
                    <Txt className='text-[8px] ml-1' color='text-red'>
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
                <AccordionTrigger className='border-b border-primarycolor'>
                  <Txt className='text-[14px]'>
                    대출 상품 약관 동의서
                    <Txt className='text-[8px] ml-1' color='text-red'>
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
            </div>
          </Accordion>
        </div>
      </div>
      <div className='w-full px-[20px] pb-[40px]'>
        <Button
          onClick={() => {
            if (!baseAgree) {
              showModal(true);
            } else {
              // 여기에 다음 페이지로 넘어가는거 추가
              const types: number[] = [];
              if (depositAgree) types.push(1); // 예금
              if (savingsAgree) types.push(2); // 적금
              if (loanAgree) types.push(3); // 대출

              router.push(`./create-account?types=${types.join(',')}`);
            }
          }}
          className='flex justify-center w-full h-[48px] text-[16px]'
        >
          다음
        </Button>
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
    </div>
  );
}
