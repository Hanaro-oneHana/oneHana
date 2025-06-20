'use server';

import { hash } from 'bcryptjs';
import prisma from '../db';

export const emailCrossCheck = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  });
};

export const createAction = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  marriageDate: string
) => {
  try {
    const hashed = await hash(password, 10);

    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        marriage_date: marriageDate,
      },
    });
  } catch (error) {
    console.error('Error: ', error);
    throw new Error('사용자 생성 실패');
  }
};
