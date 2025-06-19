'use server';

import prisma from '../db';

export const getMarriageDate = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user?.marriage_date ?? '';
};
