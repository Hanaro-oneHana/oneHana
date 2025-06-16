'use client';

import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Txt';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        console.log("이메일 또는 비밀번호가 올바르지 않습니다.")
      } else if (result?.ok) {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.log("로그인 중 오류가 발생했습니다.")
    }
  }

  const goToSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <div className='min-h-screen flex flex-col justify-center px-6'>
      <div className='text-center mb-16'>
        <Txt size='text-[36px]' weight='font-[500]'>
          두리하나
        </Txt>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <Txt>이메일</Txt>
          <Input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='abc@doorihana.com'
            className='w-full h-12 border-b-2 border-linegray focus:border-gray-500 focus:outline-none'
            required
          />
        </div>
        <div>
          <Txt>비밀번호</Txt>
          <Input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='8자 이상 입력해주세요.'
            className='w-full h-12 border-b-2 border-linegray focus:border-gray-500 focus:outline-none'
            required
            minLength={8}
          />
        </div>

        <div className='pt-8'>
          <Button type='submit'>로그인</Button>
        </div>

        <div>
          <Button className='bg-transparent text-gray' onClick={goToSignUp}>
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
}