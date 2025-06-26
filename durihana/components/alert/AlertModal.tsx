import Image from 'next/image';
import { PropsWithChildren } from 'react';

type Props = {
  onClose: () => void;
};

export default function AlertModal({
  onClose,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-100 flex items-center justify-center bg-black/50'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='bg-mainwhite flex w-[300px] flex-col items-center justify-start rounded-[10px] p-[20px]'
      >
        <div className='mb-[7px] flex w-full items-center justify-end'>
          <button onClick={onClose}>
            <Image
              src='/asset/icons/close.svg'
              alt='close'
              width={16}
              height={16}
            />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
