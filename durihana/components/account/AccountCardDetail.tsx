'use client';

import Txt from '@/components/atoms/Txt';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InputComponent } from '../atoms';
import Button from '../atoms/Button';

type AccountType = 0 | 1 | 2 | 3;

type Props = {
  type: AccountType;
  account: string;
  balance: number;
  accountId: number;
  onTransaction?: () => void;
};

const accountTypeLabelMap = {
  0: '두리함께입출금통장',
  1: '두리함께예금통장',
  2: '두리함께적금통장',
  3: '두리함께대출통장',
};

// 버튼 라벨 정의
const labelMap: { [key in AccountType]?: string } = {
  0: '입금',
  2: '입금',
  3: '대출 상환',
};

export default function AccountCardDetail({
  type,
  account,
  balance,
  accountId,
  onTransaction,
}: Props) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handleConfirm = async () => {
    const numericAmount = Number(amount.replaceAll(',', ''));
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const { plusBalance } = await import('@/lib/actions/calBalance');
      await plusBalance(accountId, numericAmount);
      onTransaction?.();
      setAmount('');
      setOpen(false);
      router.refresh();
    }
  };

  const renderButtonsByType = (type: AccountType) => {
    const label = labelMap[type];
    if (!label) return null;

    return (
      <Button className='py-2' onClick={() => setOpen(true)}>
        <Txt size='text-[14px]' weight='font-[600]' color='text-mainwhite'>
          {label}
        </Txt>
      </Button>
    );
  };

  return (
    <div className='bg-lightmint border-borderline relative rounded-[10px] border p-6'>
      <div className='absolute right-5'>
        <Image src='/asset/icons/info.svg' alt='info' width={24} height={24} />
      </div>

      <div>
        <Txt weight='font-[600]'>{accountTypeLabelMap[type]}</Txt>
        <Txt
          weight='font-[500]'
          size='text-[13px]'
          color='text-icon'
          className='mb-2 block'
        >
          {account}
        </Txt>
      </div>

      <div className='mb-4 text-right'>
        <Txt size='text-[24px]' weight='font-[600]'>
          {balance.toLocaleString()} 원
        </Txt>
      </div>

      <div className='flex justify-start'>{renderButtonsByType(type)}</div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className='h-3/10'>
          <div className='w-full p-[20px]'>
            <div className='mb-[20px]'>
              <DrawerTitle>
                <Txt>입금액 입력</Txt>
              </DrawerTitle>
            </div>
            <InputComponent
              placeholder='금액을 입력하세요'
              value={amount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남김
                const formatted = raw ? Number(raw).toLocaleString() : '';
                setAmount(formatted);
              }}
              inputMode='numeric'
              className='text-[14px]'
            />
            <Button className='mt-4 w-full' onClick={handleConfirm}>
              확인
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
