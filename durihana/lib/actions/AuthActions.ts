'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { signInValidator } from '../validator';

export async function signInValidateAction(email: string, password: string) {
  // email과 password가 비어있는 경우
  if (!email || !password) {
    return { isSuccess: false, error: '이메일, 비밀번호를 입력해주세요' };
  }

  // 이메일,비밀번호 형식이 올바른지 확인
  const validation = signInValidator.safeParse({ email, password });
  if (!validation.success) {
    return {
      isSuccess: false,
      error: '이메일 또는 비밀번호 형식이 올바르지 않습니다',
    };
  }

  const user = await findUserByEmail(email);

  // 존재하는 이메일인지 확인
  if (!user.isSuccess || !user.data) {
    return { isSuccess: false, error: '아이디가 존재하지 않습니다' };
  }

  // 비밀번호가 일치하는지 확인
  const isPasswordValid = await bcrypt.compare(
    password,
    user.data.password || ''
  );
  if (!isPasswordValid) {
    return { isSuccess: false, error: '비밀번호가 올바르지 않습니다' };
  }

  // 로그인 성공
  return { isSuccess: true, data: user.data };
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return { isSuccess: true, data: user };
  } catch (error) {
    console.log(error);
    return { isSuccess: false, error: 'User not found' };
  }
}
