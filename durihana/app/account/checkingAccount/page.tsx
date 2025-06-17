'use client';

import AlertModal from '@/components/alert/AlertModal';
import Button from '@/components/atoms/Button';
import Header from '@/components/atoms/Header';
import Txt from '@/components/atoms/Txt';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

export default function CheckingAccount() {
  const [agree, setAgree] = useState(false);
  const [modal, showModal] = useState(false);

  return (
    <div className='relative flex flex-col items-center min-h-dvh'>
      <Header leftIcon='back' title='계좌개설' />
      <div className='pl-[25px] pr-[25px]'>
        <div className='flex pt-[40px] '>
          <Txt>약관동의</Txt>
        </div>
        <Accordion type='multiple'>
          <div className='w-[325px]'>
            <AccordionItem value='item-1'>
              <AccordionTrigger className='border-b border-primarycolor'>
                <Txt className='text-[14px]'>비대면 계좌 개설 약관 동의서</Txt>
              </AccordionTrigger>
              <AccordionContent className='flex flex-col gap-4 pt-[16px]'>
                <div className='text-[8px] text-gray-700 space-y-2 px-1'>
                  <p>
                    본인은 아래 내용을 충분히 이해하였으며, 비대면으로 계좌
                    개설을 진행하는 데 동의합니다.
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>
                      본 계좌는 실명확인 및 본인 인증 절차를 거쳐 개설됩니다.
                    </li>
                    <li>
                      개인정보 수집·이용, 전자적 방법에 의한 본인 확인 및 비대면
                      금융거래에 동의합니다.
                    </li>
                    <li>
                      예금의 입·출금, 이자 지급 등 거래는 당행의 관련 약관 및
                      규정에 따릅니다.
                    </li>
                    <li>
                      본 계좌는 예금자보호법에 따라 1인당 5천만
                      원(원금+이자)까지 보호됩니다.
                    </li>
                    <li>
                      금융사고 예방을 위해 비정상적인 거래 발생 시 계좌가 정지
                      또는 해지될 수 있습니다.
                    </li>
                    <li>
                      기타 본 약관에 정하지 않은 사항은 관련 법령 및 당행의 내부
                      규정에 따릅니다.
                    </li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>

          <div className='w-[325px]'>
            <AccordionItem value='item-2'>
              <AccordionTrigger className='border-b border-primarycolor'>
                <Txt className='text-[14px]'>입출금 상품 약관 동의서</Txt>
              </AccordionTrigger>
              <AccordionContent className='flex flex-col gap-4 pt-[16px]'>
                <div className='text-[8px] text-gray-700 space-y-2 px-1'>
                  <p>
                    본인은 아래 정기예금 약관의 주요 내용을 확인하고 이에
                    동의합니다.
                  </p>
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>
                      본 예금은 실명으로 개설하며, 일정 기간 예치 후 만기일에
                      원금과 이자를 지급받습니다.
                    </li>
                    <li>
                      만기 전 해지 시 중도해지 이율이 적용되어 이자가 감액될 수
                      있습니다.
                    </li>
                    <li>
                      만기일에 별도 해지 요청이 없을 경우, 자동 재예치되며,
                      재예치 시점의 이율이 적용됩니다.
                    </li>
                    <li>
                      본 예금은 예금자보호법에 따라 1인당 5천만 원까지
                      보호됩니다.
                    </li>
                    <li>
                      금융사고 예방을 위해 비정상적인 거래 발생 시 계좌가 정지
                      또는 해지될 수 있습니다.
                    </li>
                    <li>
                      기타 세부사항은 당행 내부 규정 및 금융관례를 따릅니다.
                    </li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        </Accordion>
        <div className='flex items-center justify-end pr-[25px]'>
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

      <Button
        onClick={() => {
          if (!agree) {
            showModal(true);
          } else {
            // 여기에 다음 페이지로 넘어가는거 추가
          }
        }}
        className='absolute flex justify-center bottom-[40px] left-[50%] w-[335px] h-[48px] text-[16px] translate-x-[-50%]'
      >
        다음
      </Button>

      {modal && (
        <AlertModal onClose={() => showModal(false)}>
          <Txt align='text-center'>
            약관에 동의해야 <br />
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
