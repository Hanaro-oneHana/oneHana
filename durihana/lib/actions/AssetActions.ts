'use server';

import prisma from '../db';

type TypeAmount = {
  name: string;
  value: number;
};

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

  // 카테고리 타입과 가격 정보만 추출하여 {name, value} 형태로
  const rawData: TypeAmount[] = calendars
    .map((calendar) => {
      const service = calendar.PartnerService;
      const categoryType = service.Partner.PartnerCategory.type;
      const content = service.content;

      const price = extractPrice(content);
      return { name: categoryType, value: price };
    })
    .filter((item): item is TypeAmount => item !== null);

  console.log('🚀 ~ getTypeAmounts ~ rawData:', rawData);

  // name(제휴 타입) 기준으로 value(가격) 누적 합산
  const amountMap = new Map<string, number>();

  rawData.forEach(({ name, value }) => {
    const current = amountMap.get(name) ?? 0;
    amountMap.set(name, value + current);
  });

  const result: TypeAmount[] = Array.from(amountMap).map(([name, value]) => ({
    name,
    value,
  }));

  return result;
};

// 웨딩 버켓 총 금액 가져오기
export const getBucketTotalAmount = async (userId: number) => {
  const budgetplans = await prisma.budgetPlan.findMany({
    where: { user_id: userId },
    select: {
      PartnerService: {
        select: {
          content: true,
        },
      },
    },
  });

  const prices: number[] = budgetplans.map((budgetplan) => {
    const content = budgetplan.PartnerService.content;

    return extractPrice(content);
  });

  const result = prices.reduce((acc, val) => acc + val, 0);

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
