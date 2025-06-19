'use server';

import prisma from '../db';

export const getStoreDetail = async (storeId: number) => {
  const detail = await prisma.partnerservice.findUnique({
    where: {
      id: storeId, // partnerservice의 PK
    },
    select: {
      id: true,
      name: true,
      content: true, // JSON 필드
      partner: {
        select: {
          address: true,
          partnercategory: {
            select: {
              type: true, // '예식장', '스드메', '여행' 중 하나
            },
          },
        },
      },
    },
  });

  return detail;
};

export const insertOptions = async (
  user_id: number,
  partner_service_id: number,
  options?: Record<string, string>
) => {
  return await prisma.budgetplan.create({
    data: {
      user_id,
      partner_service_id,
      selected: options, // ✅ Prisma에서 Json 타입에 그대로 넣으면 됨
    },
  });
};
