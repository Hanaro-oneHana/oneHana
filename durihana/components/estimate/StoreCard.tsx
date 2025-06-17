import Image from 'next/image';
import Txt from '../atoms/Txt';

export default function StoreCard() {
  return (
    <div className='flex flex-row items-center justify-start w-full border-b-[1px] border-linegray gap-[20px] pb-[20px]'>
      <Image
        src='/asset/icons/default-store.svg'
        alt='Store Image'
        width={60}
        height={60}
      />
      <div className='flex flex-col items-start justify-center w-full gap-[5px]'>
        <Txt size='text-[14px]' weight='font-[500]'>
          두리 하나 스토어
        </Txt>
        <Txt size='text-[10px]' weight='font-[400]' color='text-textgray'>
          서울특별시
          <br />
          5000만원~5500만원 | ~ 250명
        </Txt>
      </div>
    </div>
  );
}
