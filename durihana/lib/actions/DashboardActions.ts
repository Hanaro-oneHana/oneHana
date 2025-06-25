'use server';

import prisma from '../db';

export const getMarriageDate = async (userId: number) => {
  if (!userId) return '';
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user?.marriage_date ?? '';
};

export const getCategoriesByUserId = async (userId?: number) => {
  if (!userId) return [];
  const calendars = await prisma.partnerCalendar.findMany({
    where: { user_id: userId },
    select: {
      PartnerService: {
        select: {
          Partner: {
            select: {
              PartnerCategory: {
                select: {
                  type: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!calendars.length) return [];

  const result = calendars.map(
    (calendar) => calendar.PartnerService.Partner.PartnerCategory.type
  );

  return result;
};
