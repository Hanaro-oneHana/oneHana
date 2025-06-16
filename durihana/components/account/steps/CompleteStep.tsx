import Txt from '@/components/atoms/Txt';
import { ACCOUNT_TYPES } from '@/types/Schedule';

type CompleteStepProps = {
  accountType: number;
  isLastAccount: boolean;
};

export default function CompleteStep({
  accountType,
  isLastAccount,
}: CompleteStepProps) {
  const accountTypeName =
    ACCOUNT_TYPES[accountType as keyof typeof ACCOUNT_TYPES];

  return (
    <div className='flex-1 px-6 py-8 flex flex-col items-center justify-center'>
      <div className='flex-1 flex flex-col items-center justify-center'>
        <img
          src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tlXM0o07r883qH4ZgMBzuy5W6OSCrX.png'
          alt='완료'
          className='w-32 h-32 mb-8 object-contain'
        />

        <Txt
          size='text-[18px]'
          weight='font-[600]'
          className='text-mainblack text-center mb-4'
        >
          {accountTypeName} 가입이 완료됐습니다
        </Txt>

        {!isLastAccount && (
          <Txt size='text-[14px]' className='text-gray-500 text-center'>
            다음 상품을 계속 가입하시겠습니까?
          </Txt>
        )}
      </div>
    </div>
  );
}
