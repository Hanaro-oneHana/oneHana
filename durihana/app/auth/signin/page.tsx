'use client';

import { Button, Txt, InputComponent } from '@/components/atoms';
import Container from '@/components/containers/Container';
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
          name: result.data?.name || '',
          partnerCode: result.data?.mate_code || 0,
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
    <Container className='gap-[60px] pt-[150px]'>
      <Txt
        size='text-[36px]'
        weight='font-[500]'
        align='text-center'
        className='w-full'
      >
        두리하나
      </Txt>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className='flex w-full flex-col'>
        <div className='mb-6 flex w-full flex-col gap-[10px]'>
          <Txt weight='font-[500]'>이메일</Txt>
          <InputComponent
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='abc@doorihana.com'
            className='text-primarycolor placeholder:text-buttongray text-[14px] font-[600]'
            required
          />
        </div>
        <div className='mb-6 flex w-full flex-col gap-[10px]'>
          <Txt weight='font-[500]'>비밀번호</Txt>
          <InputComponent
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='8자 이상 입력해주세요'
            className='text-primarycolor placeholder:text-buttongray text-[14px] font-[600]'
            required
            minLength={8}
          />
          <Txt
            size='text-[10px]'
            color='text-red'
            weight='font-[500]'
            className='mt-2'
          >
            {error ? `*${error}` : ''}
          </Txt>
        </div>

        <Button type='submit'>로그인</Button>
        <Button className='bg-transparent' onClick={goToSignUp}>
          <Txt
            weight='font-[500]'
            color='text-textgray'
            size='text-[13px]'
            align='text-center'
          >
            회원가입
          </Txt>
        </Button>
      </form>
    </Container>
  );
}
