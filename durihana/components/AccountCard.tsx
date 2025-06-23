'use client';

import Txt from '@/components/atoms/Txt';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket-client';

export type SubAccount = {
  type: 1 | 2 | 3; // 1:예금, 2:적금, 3:대출
  balance: number;
};

export type MainAccount = {
  type: 0;
  account: string;
  balance: number;
};

type Props = {
  userId: number;
  mainAccount: MainAccount;
  subAccounts: SubAccount[];
  coupleBalance: number;
};

// type에 따른 통장 이름 매핑
export const accountTypeLabelMap = {
  0: '두리함께입출금',
  1: '두리함께예금',
  2: '두리함께적금',
  3: '두리함께대출',
};

export default function AccountCard({
  userId,
  mainAccount: initialMainAccount,
  subAccounts: initialSubAccounts,
  coupleBalance: initialCoupleBalance,
}: Props) {
  const router = useRouter();
  const [mainAccount, setMainAccount] = useState(initialMainAccount);
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
        // 메인 계좌 (입출금) 업데이트
        setMainAccount((prev) => ({
          ...prev,
          balance: data.newBalance,
        }));
      } else {
        // 서브 계좌 업데이트
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
      className='flex flex-col w-full relative bg-lightmint border border-linegray rounded-[10px] p-6 '
      onClick={onCardClick}
    >
      <div className='absolute right-5 '>
        <Image
          src='/asset/icons/info.svg'
          alt='info'
          width={24}
          height={24}
          className='text-navy'
        />
      </div>

      <div>
        <Txt weight='font-[600]'>{accountTypeLabelMap[mainAccount.type]}</Txt>
      </div>

      <div className='text-right'>
        <Txt size='text-[24px]' weight='font-[600]'>
          {coupleBalance.toLocaleString()} 원
        </Txt>
      </div>

      <div className='flex flex-col gap-2 mt-3'>
        {subAccounts.map((item) => (
          <div key={item.type} className='flex justify-between items-center'>
            <div className='bg-primarycolor px-[7px] py-[2px] rounded-[10px] flex items-center'>
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
