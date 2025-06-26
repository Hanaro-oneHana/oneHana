import { Txt } from '@/components/atoms';

export default function CheckingAccountAgreement() {
  return (
    <>
      <Txt size='text-[8px]' color='text-mainblack' className='space-y-2 px-1'>
        <p>
          본인은 아래 정기입출금 약관의 주요 내용을 확인하고 이에 동의합니다.
        </p>
        <ol className='list-decimal space-y-1 pl-5'>
          <li>
            본 예금은 실명으로 개설하며, 일정 기간 예치 후 만기일에 원금과
            이자를 지급받습니다.
          </li>
          <li>
            만기 전 해지 시 중도해지 이율이 적용되어 이자가 감액될 수 있습니다.
          </li>
          <li>
            만기일에 별도 해지 요청이 없을 경우, 자동 재예치되며, 재예치 시점의
            이율이 적용됩니다.
          </li>
          <li>본 예금은 예금자보호법에 따라 1인당 5천만 원까지 보호됩니다.</li>
          <li>
            금융사고 예방을 위해 비정상적인 거래 발생 시 계좌가 정지 또는 해지될
            수 있습니다.
          </li>
          <li>기타 세부사항은 당행 내부 규정 및 금융관례를 따릅니다.</li>
        </ol>
      </Txt>
    </>
  );
}
