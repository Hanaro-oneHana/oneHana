'use server';

import prisma from '../db';

// 웨딩 관련 지출 내역 가져오기
export const getTypeAmounts = async (userId: number) => {
  const calendars = await prisma.partnerCalendar.findMany({
    where: { user_id: userId },
    select: {
      PartnerService: {
        select: {
          content: true,
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

  // 웨딩 카테고리별로 지출한 금액 리턴
  return calendars.map((calendar) => {
    const service = calendar.PartnerService;
    const categoryType = service.Partner.PartnerCategory.type;
    const content = service.content;

    return {
      name: categoryType,
      value: extractPrice(content),
    };
  });
};

// 웨딩 버켓 총 금액 가져오기 (항목별로 가장 비싼 것들만 집계)
export const getBucketTotalAmount = async (userId: number) => {
  const budgetplans = await prisma.budgetPlan.findMany({
    where: { user_id: userId },
    select: {
      PartnerService: {
        select: {
          content: true,
          Partner: {
            select: {
              partner_category_id: true,
            },
          },
        },
      },
    },
  });

  // 웨딩 카테고리별로 가장 비싼 가격만 Map에 저장
  const maxAmounts = budgetplans.reduce((acc, budgetplan) => {
    const service = budgetplan.PartnerService;
    const categoryId = service.Partner.partner_category_id;
    const content = service.content;

    const price = extractPrice(content);
    const currentMax = acc.get(categoryId) ?? 0;

    if (price > currentMax) {
      acc.set(categoryId, price);
    }

    return acc;
  }, new Map<number, number>());

  const result = Array.from(maxAmounts.values()).reduce(
    (acc, val) => acc + val,
    0
  );

  return result;
};

// json타입인 content에서 가격 추출
function extractPrice(content: unknown) {
  if (typeof content == 'object' && content !== null && '가격' in content) {
    const price = content['가격'];

    if (typeof price === 'number') return price;
    else if (typeof price === 'string' && !isNaN(+price)) return +price;
  }

  return 0;
}
