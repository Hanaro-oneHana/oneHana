'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { updateRandomCode, tryMating } from '../lib/actions/InviteActions';
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
  const params = useSearchParams();
  const idParam = params.get('id');
  const id = idParam ? Number(idParam) : null;

  useEffect(() => {
    if (!id) return;
    const code = generateRandomCode();
    setRandomCode(code);
    updateRandomCode(id, code);
  }, [id]);

  const tryConnecting = async (id: number, mate_code: string) => {
    setLoading(true);
    const mate = await tryMating(id, mate_code);
    if (mate.status === 'success') {
      setLoading(false);
      alert('연결 성공');
    } else {
      alert('상대방이 없습니다');
    }
  };

  const handleConnect = () => {
    if (!id) return; // id가 없으면 그냥 리턴
    tryConnecting(id, mateCode);
  };

  const onlyDigit = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setMateCode(digits);
  };

  return (
    <>
      <div className='flex flex-col px-6 pb-6'>
        <div className='flex-1 pt-[120px]'>
          <Txt className='text-[16px] mb-1'>내 초대코드</Txt>
          <div className='flex items-center gap-2 mb-4'>
            <InputComponent
              value={randomCode}
              disabled
              className='text-primarycolor text-[14px] font-[600] flex-1'
            />
          </div>

          <Txt className='text-[16px] mb-1'>
            상대방 초대코드를 전달받으셨나요?
          </Txt>
          <InputComponent
            value={mateCode}
            onChange={onlyDigit}
            placeholder='전달받은 초대코드 입력'
            maxLength={8}
            className='text-primarycolor text-[14px] font-[600] placeholder:font-[400] mb-8'
          />
        </div>
        <div className='flex justify-center'>
          <Image
            src={'/asset/icons/princess-hugging.svg'}
            alt='공주님안기'
            width={240}
            height={240}
          />
        </div>

        <Button
          className='absolute flex justify-center bottom-[40px] left-[50%] w-[335px] h-[48px] text-[16px] translate-x-[-50%]'
          onClick={handleConnect}
        >
          연결하기
        </Button>
      </div>
    </>
  );
}
