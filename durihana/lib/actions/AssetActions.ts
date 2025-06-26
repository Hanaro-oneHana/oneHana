'use server';

import { CategoryData } from '@/types/Asset';
import prisma from '../db';

const SPECIAL_CATEGORIES = ['예식장', '스드메', '신혼여행'];
const NORMAL_CARTEGORIES = ['가전·가구', '예물·예단'];

// 웨딩 관련 지출 내역 가져오기
export const getCategoryData = async (userId: number) => {
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

  const rawData = calendars.map((calendar) => ({
    category: calendar.PartnerService.Partner.PartnerCategory.type,
    value: extractPrice(calendar.PartnerService.content),
  }));

  return aggregateByCategory(rawData);
};

// 웨딩 버켓 총 금액 가져오기
export const getBucketTotalAmount = async (userId: number) => {
  const budgetplans = await prisma.budgetPlan.findMany({
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

  const rawData = budgetplans.map((budgetplan) => ({
    category: budgetplan.PartnerService.Partner.PartnerCategory.type,
    value: extractPrice(budgetplan.PartnerService.content),
  }));

  const result = Array.from(aggregateByCategory(rawData).values()).reduce(
    (sum, { value }) => sum + value,
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

// 예식장 스드메 신혼여행은 비싼 것만 집계, 가전가구 예물예단은 합산 금액으로 정제
function aggregateByCategory(rawData: CategoryData[]) {
  const amountMap = new Map<string, number>();

  rawData.forEach(({ category, value }) => {
    const current = amountMap.get(category) ?? 0;

    if (SPECIAL_CATEGORIES.includes(category)) {
      // 최고 금액
      amountMap.set(category, Math.max(current, value));
    } else if (NORMAL_CARTEGORIES.includes(category)) {
      // 합산
      amountMap.set(category, current + value);
    } else {
      // isSuccess: false
    }
  });

  return Array.from(amountMap).map(([category, value]) => ({
    category,
    value,
  }));
}
