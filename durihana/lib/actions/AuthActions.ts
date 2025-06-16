import prisma from '@/lib/db';

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('findUserByEmail error:', error);
    return null;
  }
}
