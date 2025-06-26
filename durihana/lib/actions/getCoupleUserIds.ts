'use server';

import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function getCoupleUserIds(userId: number): Promise<number[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { code: true, mate_code: true },
  });

  if (!user?.code || !user?.mate_code) return [userId]; // 커플이 아닌 경우

  const coupleUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          code: user.code,
          mate_code: user.mate_code,
        },
        {
          code: user.mate_code,
          mate_code: user.code,
        },
      ],
    },
    select: { id: true },
  });

  return coupleUsers.map((u) => u.id);
}

export async function getCoupleNames(userId: number): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { code: true, mate_code: true },
  });

  if (!user?.code || !user?.mate_code) return [];

  const coupleUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          code: user.code,
          mate_code: user.mate_code,
        },
        {
          code: user.mate_code,
          mate_code: user.code,
        },
      ],
    },
    select: { name: true },
  });

  return coupleUsers.map((u) => u.name);
}
