'use client';

import { Txt } from '@/components/atoms';
import { accountTypeLabelMap, MainAccount, SubAccount } from '@/types/Account';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket-client';

type Props = {
  userId: number;
  subAccounts: SubAccount[];
  coupleBalance: number;
  coupleNames: string[];
};

export default function AccountCard({
  userId,
  subAccounts: initialSubAccounts,
  coupleBalance: initialCoupleBalance,
  coupleNames,
}: Props) {
  const router = useRouter();
  const [subAccounts, setSubAccounts] = useState(initialSubAccounts);
  const [coupleBalance, setCoupleBalance] = useState(initialCoupleBalance);

  useEffect(() => {
    // Socket 연결 및 사용자 룸 참여
    function onConnect() {
      socket.emit('join-user-room', userId);
    }

    // 잔액 업데이트 이벤트 리스너
    function onBalanceUpdated(data: {
      accountId: number;
      newBalance: number;
      accountType: number;
      coupleBalance: number;
    }) {
      setCoupleBalance(data.coupleBalance);

      if (data.accountType === 0) {
        setSubAccounts((prev) =>
          prev.map((acc) =>
            acc.type === data.accountType
              ? { ...acc, balance: data.newBalance }
              : acc
          )
        );
      }
    }

    socket.on('connect', onConnect);
    socket.on('balance-updated', onBalanceUpdated);

    // 이미 연결되어 있다면 룸 참여
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('balance-updated', onBalanceUpdated);
    };
  }, [userId]);

  const onCardClick = () => {
    router.push(`/account/detail/${userId}`);
  };

  return (
    <div
      className='bg-lightmint border-linegray relative flex w-full cursor-pointer flex-col rounded-[10px] border p-6'
      onClick={onCardClick}
    >
      <div className='absolute right-5'>
        <Image
          src='/asset/icons/info.svg'
          alt='info'
          width={24}
          height={24}
          className='text-navy'
        />
      </div>
      <div className='flex w-full flex-row items-center justify-start gap-[1px]'>
        <Txt weight='font-[600]'>{coupleNames[0]}</Txt>
        <Image src='/asset/icons/love.svg' alt='love' width={18} height={18} />
        <Txt weight='font-[600]'>{coupleNames[1]}</Txt>
      </div>
      <Txt size='text-[24px]' weight='font-[600]' className='text-right'>
        {coupleBalance.toLocaleString()} 원
      </Txt>
      <div className='mt-3 flex flex-col gap-2'>
        {subAccounts.map((item) => (
          <div key={item.type} className='flex items-center justify-between'>
            <div className='bg-primarycolor flex items-center rounded-[10px] px-[7px] py-[2px]'>
              <Txt
                color='text-mainwhite'
                size='text-[10px]'
                weight='font-[500]'
              >
                {accountTypeLabelMap[item.type]}
              </Txt>
            </div>

            <Txt weight='font-[500]' size='text-[13px]' color='text-icon'>
              {item.balance.toLocaleString()}원
            </Txt>
          </div>
        ))}
      </div>
    </div>
  );
}
