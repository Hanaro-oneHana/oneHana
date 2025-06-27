'use client';

import { Button, InputComponent, Txt } from '@/components/atoms';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { socket } from '@/lib/socket-client';
import { AccountType, accountTypeLabelMap } from '@/types/Account';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  type: AccountType;
  account: string;
  balance: number;
  accountId: number;
  onTransaction?: () => void;
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
      
      const result = await plusBalance(accountId, numericAmount);
      if (result.success && result.socketData) {
      // 서버에게 uids와 payload를 전달
      socket.emit('admin-balance-update', {
        uids: result.socketData.coupleUserIds,
        payload: {
          accountId: result.socketData.accountId,
          newBalance: result.socketData.newBalance,
          accountType: result.socketData.accountType,
          coupleBalance: result.socketData.coupleBalance,
        },
      });
    }
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
    <div className='bg-lightmint border-borderline relative flex w-full flex-col rounded-[10px] border p-6'>
      <div className='absolute right-5'>
        <Image src='/asset/icons/info.svg' alt='info' width={24} height={24} />
      </div>

      <Txt weight='font-[600]'>{accountTypeLabelMap[type]}</Txt>
      <Txt
        weight='font-[500]'
        size='text-[13px]'
        color='text-icon'
        className='mb-2 block'
      >
        {account}
      </Txt>

      <Txt size='text-[24px]' weight='font-[600]' className='mb-4 text-right'>
        {balance.toLocaleString()} 원
      </Txt>

      {renderButtonsByType(type)}

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
