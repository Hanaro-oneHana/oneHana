import Txt from '@/components/atoms/Txt';

export default function LoanReviewStep() {
  return (
    <div className='flex-1 px-6 py-8 flex flex-col items-center justify-center'>
      <Txt
        size='text-[24px]'
        weight='font-[600]'
        className='text-mainblack mb-16'
      >
        두리아나대출통장
      </Txt>

      <div className='flex-1 flex flex-col items-center justify-center'>
        <img
          src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FyBzlYn07qlU3bRXq3e032D5FOMAVh.png'
          alt='대출 심사'
          className='w-48 h-48 mb-8 object-contain'
        />

        <Txt
          size='text-[18px]'
          weight='font-[600]'
          className='text-mainblack mb-2'
        >
          대출 승인 심사가 신청되었습니다
        </Txt>
        <Txt size='text-[14px]' className='text-gray-500 text-center'>
          영업일 기준 1~3일 이내 승인
        </Txt>
      </div>
    </div>
  );
}
