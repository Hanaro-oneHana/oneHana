import prisma from '../db';

export const getStoreDetail = async (storeId: number) => {
  const detail = await prisma.partnerservice.findUnique({
    where: {
      id: storeId, // partnerservice의 PK
    },
    select: {
      name: true,
      content: true, // JSON 필드
      partner: {
        select: {
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
