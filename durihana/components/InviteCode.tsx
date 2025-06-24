'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { findPartnerId } from '@/lib/actions/AuthActions';
import { updateRandomCode, tryMating } from '../lib/actions/InviteActions';
import AlertModal from './alert/AlertModal';
import Button from './atoms/Button';
import InputComponent from './atoms/InputComponent';
import Txt from './atoms/Txt';

function generateRandomCode(length: number = 8): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    // 0~9 사이 랜덤 정수
    const digit = Math.floor(Math.random() * 10);
    result += digit;
  }
  return result;
}

export default function InviteCode() {
  const [randomCode, setRandomCode] = useState('');
  const [mateCode, setMateCode] = useState('');
  const [loading, setLoading] = useState(false);
  console.log('🚀 ~ InviteCode ~ loading:', loading);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: session, update } = useSession(); // ← 세션 및 로딩 상태
  const rawId = session?.user?.id as number | undefined;
  const userId = Number(rawId);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    const code = generateRandomCode();
    setRandomCode(code);
    updateRandomCode(userId, code);
  }, [userId]);

  const tryConnecting = async (id: number, mate_code: string) => {
    if (!id) return;
    setLoading(true);
    const mate = await tryMating(id, mate_code);
    setLoading(false);

    if (mate.status === 'success') {
      const partnerId = await findPartnerId(mate_code);
      update({
        user: {
          id: userId,
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          partnerId: partnerId.data,
          isMain: userId && partnerId.data && userId < Number(partnerId.data),
        },
      });
      setModalMessage('연결 성공');
      setIsSuccess(true);
    } else {
      setModalMessage('상대방이 없습니다');
      setIsSuccess(false);
    }
    setModalOpen(true);
  };

  const handleConnect = () => {
    if (!userId) return; // id가 없으면 그냥 리턴
    tryConnecting(userId, mateCode);
  };

  const onlyDigit = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setMateCode(digits);
  };

  return (
    <div className='flex flex-col pt-[120px] h-dvh px-[20px]  relative '>
      <div className='flex flex-col items-center gap-[15px] mb-[20px]'>
        <Txt className='text-[16px] w-full'>내 초대코드</Txt>
        <InputComponent
          value={randomCode}
          disabled
          className='text-primarycolor text-[14px] font-[600]'
        />
        <Txt className='text-[16px] w-full mt-[10px]'>
          상대방 초대코드를 전달받으셨나요?
        </Txt>
        <InputComponent
          value={mateCode}
          onChange={onlyDigit}
          placeholder='전달받은 초대코드 입력'
          maxLength={8}
          className='text-primarycolor text-[14px] font-[600] placeholder:font-[400] '
        />
      </div>
      <div className='flex justify-center'>
        <Image
          src={'/asset/icons/bubu.png'}
          alt='공주님안기'
          width={240}
          height={240}
        />
      </div>
      <div className='absolute flex px-[20px] justify-center bottom-[40px] left-[50%] w-full h-[48px] text-[16px] translate-x-[-50%]'>
        <Button onClick={handleConnect}>연결하기</Button>
      </div>

      {modalOpen && (
        <AlertModal onClose={() => setModalOpen(false)}>
          <Txt size='text-[16px]' className='text-mainblack text-center'>
            {modalMessage}
          </Txt>
          {isSuccess ? (
            <Button
              className='mt-[20px] w-full'
              onClick={() => router.push('/account/checking-account')}
            >
              계좌 만들러가기
            </Button>
          ) : (
            <Button
              className='mt-[20px] w-full'
              onClick={() => setModalOpen(false)}
            >
              확인
            </Button>
          )}
        </AlertModal>
      )}
    </div>
  );
}
