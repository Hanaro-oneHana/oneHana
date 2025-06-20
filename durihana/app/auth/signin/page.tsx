'use client';

import { Button, Txt, InputComponent } from '@/components/atoms';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import type React from 'react';
import { FormEvent, useState } from 'react';
import { signInValidateAction } from '@/lib/actions/AuthActions';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // 이메일 비밀번호 유효성 검사
      const result = await signInValidateAction(email, password);
      if (result.isSuccess) {
        // 로그인 성공 시 NextAuth로 로그인 처리
        const signInResult = await signIn('credentials', {
          redirect: false,
          id: result.data?.id || '',
          email: email,
          password: password,
        });
        if (signInResult?.error) {
          setError('로그인에 실패했습니다');
        } else {
          router.push('/');
        }
      } else {
        setError(result.error || '로그인에 실패했습니다.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  const goToSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <div className=' flex flex-col justify-center px-[20px] pt-[120px]'>
      <div className='text-center mb-16'>
        <Txt size='text-[36px]' weight='font-[500]' align='text-center'>
          두리하나
        </Txt>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <Txt weight='font-[500]'>이메일</Txt>
          <InputComponent
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='abc@doorihana.com'
            className='text-primarycolor text-[14px] font-[600] placeholder:text-buttongray'
            required
          />
        </div>
        <div>
          <Txt weight='font-[500]'>비밀번호</Txt>
          <InputComponent
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='8자 이상 입력해주세요'
            className='text-primarycolor text-[14px] font-[600] placeholder:text-buttongray'
            required
            minLength={8}
          />
        </div>

        <Txt
          size='text-[10px]'
          color='text-red'
          weight='font-[500]'
          className='mt-2'
        >
          {error ? `*${error}` : ''}
        </Txt>

        <div className='pt-8'>
          <Button type='submit'>로그인</Button>
        </div>
        <div>
          <Button className='bg-transparent jus' onClick={goToSignUp}>
            <Txt
              weight='font-[500]'
              color='text-textgray'
              size='text-[13px]'
              align='text-center'
            >
              회원가입
            </Txt>
          </Button>
        </div>
      </form>
    </div>
  );
}
