'use server';

import prisma from '../db';

export const updateRandomCode = async (id: number, code: string) => {
  await prisma.user.update({
    where: { id },
    data: {
      code,
    },
  });
};

//id랑 사용자가 입력한 mate_code 받아서 연결 시도
export const tryMating = async (id: number, mate_code: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return { status: 'error', message: '사용자를 찾을 수 없습니다' };
  }

  if (user.mate_code) {
    return {
      status: 'already_linked',
      message: '이미 초대코드를 입력하셨습니다',
    };
  }

  //입력한 mate_code 의 상대방이 있는지 확인
  const mateUser = await prisma.user.findFirst({
    where: { code: mate_code },
  });

  if (!mateUser) {
    //해당하는 code 의 사용자가 없을 때
    return {
      status: 'error',
      message: '상대방이 없습니다',
    };
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      mate_code,
    },
  });

  return {
    status: 'success',
  };
};
