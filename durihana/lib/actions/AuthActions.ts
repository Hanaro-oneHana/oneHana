'use server';

import { compare, hash } from 'bcryptjs';
import prisma from '@/lib/db';
import { signInValidator, userValidator } from '../validator';

export async function signUpAction(
  name: string,
  email: string,
  password: string,
  phone: string,
  marriageDate: string
) {
  // 필수 입력값이 비어있는 경우
  if (!name) {
    return { isSuccess: false, type: 'name', error: '*이름을 입력해주세요' };
  }
  if (!email) {
    return { isSuccess: false, type: 'email', error: '*이메일을 입력해주세요' };
  }

  if (!password) {
    return {
      isSuccess: false,
      type: 'password',
      error: '*비밀번호를 입력해주세요',
    };
  }
  if (!phone) {
    return {
      isSuccess: false,
      type: 'phone',
      error: '*휴대폰 번호를 입력해주세요',
    };
  }
  if (!marriageDate) {
    return {
      isSuccess: false,
      type: 'marriageDate',
      error: '*결혼 예정일을 입력해주세요',
    };
  }

  // 이메일 형식이 올바른지 확인
  const validation = userValidator.safeParse({
    name,
    email,
    password,
    phone,
    marriageDate,
  });
  if (!validation.success) {
    return {
      isSuccess: false,
      type: validation.error.issues[0].path[0],
      error: validation.error.issues[0].message,
    };
  }

  // 이메일 중복 확인
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      isSuccess: false,
      type: 'email',
      error: '*이미 사용 중인 이메일입니다',
    };
  }

  // 비밀번호 해싱
  const hashedPassword = await hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        marriage_date: marriageDate,
      },
    });

    return { isSuccess: true, data: newUser };
  } catch (error) {
    console.error('사용자 생성 실패:', error);
    return { isSuccess: false, error: '사용자 생성에 실패했습니다' };
  }
}

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
  const isPasswordValid = await compare(password, user.data.password || '');
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

    if (!user) {
      return { isSuccess: false, error: '사용자를 찾을 수 없습니다' };
    }

    return { isSuccess: true, data: user };
  } catch (error) {
    console.log(error);
    return { isSuccess: false, error: '사용자를 찾을 수 없습니다' };
  }
}

export async function findPartnerId(code: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { code: code },
      select: { id: true },
    });

    if (!user) {
      return { isSuccess: false, error: '파트너를 찾을 수 없습니다' };
    }

    return { isSuccess: true, data: user.id };
  } catch (error) {
    console.log(error);
    return { isSuccess: false, error: '파트너를 찾을 수 없습니다' };
  }
}
