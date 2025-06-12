import Image from 'next/image';
import Txt from './Txt';

export default function BottomNavigation() {
  return (
    <div className='fixed bottom-0 left-0 right-0 py-15 bg-mainwhite flex items-center justify-center'>
      <button className='flex flex-col items-center'>
        <Image
          src={'/asset/icons/home.svg'}
          alt={'home'}
          width={24}
          height={24}
        />
        <Txt size='text-[11px]' weight='font-[600]' color='text-icon'>
          홈
        </Txt>
      </button>
      <button className='flex flex-col items-center'>
        <Image
          src={'/asset/icons/store.svg'}
          alt={'store'}
          width={24}
          height={24}
        />
        <Txt size='text-[11px]' weight='font-[600]' color='text-icon'>
          제휴처
        </Txt>
      </button>
      <button className='flex flex-col items-center'>
        <Image
          src={'/asset/icons/asset.svg'}
          alt={'asset'}
          width={24}
          height={24}
        />
        <Txt size='text-[11px]' weight='font-[600]' color='text-icon'>
          자산
        </Txt>
      </button>
      <button className='flex flex-col items-center'>
        <Image
          src={'/asset/icons/asset.svg'}
          alt={'asset'}
          width={24}
          height={24}
        />
        <Txt size='text-[11px]' weight='font-[600]' color='text-icon'>
          일정
        </Txt>
      </button>
      <button className='flex flex-col items-center'>
        <Image
          src={'/asset/icons/asset.svg'}
          alt={'asset'}
          width={24}
          height={24}
        />
        <Txt size='text-[11px]' weight='font-[600]' color='text-icon'>
          메뉴
        </Txt>
      </button>
    </div>
  );
}
