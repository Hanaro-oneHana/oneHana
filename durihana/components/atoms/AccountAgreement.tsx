import Txt from './Txt';

export default function AccountAgreement() {
  return (
    <>
      <Txt size='text-[8px]' color='text-mainblack' className='space-y-2 px-1'>
        <p>
          본인은 아래 내용을 충분히 이해하였으며, 비대면으로 계좌 개설을
          진행하는 데 동의합니다.
        </p>
        <ol className='list-decimal pl-5 space-y-1'>
          <li>본 계좌는 실명확인 및 본인 인증 절차를 거쳐 개설됩니다.</li>
          <li>
            개인정보 수집·이용, 전자적 방법에 의한 본인 확인 및 비대면
            금융거래에 동의합니다.
          </li>
          <li>
            예금의 입·출금, 이자 지급 등 거래는 당행의 관련 약관 및 규정에
            따릅니다.
          </li>
          <li>
            본 계좌는 예금자보호법에 따라 1인당 5천만 원(원금+이자)까지
            보호됩니다.
          </li>
          <li>
            금융사고 예방을 위해 비정상적인 거래 발생 시 계좌가 정지 또는 해지될
            수 있습니다.
          </li>
          <li>
            기타 본 약관에 정하지 않은 사항은 관련 법령 및 당행의 내부 규정에
            따릅니다.
          </li>
        </ol>
      </Txt>
    </>
  );
}
