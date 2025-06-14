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
      className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='flex flex-col items-center justify-start bg-mainwhite rounded-[10px] p-[20px] w-[300px]'
      >
        <div className='flex items-center justify-end w-full mb-[7px]'>
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
