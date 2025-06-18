'use server';

import prisma from '../db';

type TypeAmount = {
  name: string;
  value: number;
};

// 웨딩 관련 지출 내역 가져오기
export const getTypeAmounts = async (userId: number) => {
  // 유저의 제휴 캘린더 전체 조회
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

      const price =
        typeof content === 'object' && content !== null && '가격' in content
          ? content['가격']
          : null;

      if (typeof price === 'number') {
        return { name: categoryType, value: price };
      } else if (typeof price === 'string' && !isNaN(+price)) {
        return { name: categoryType, value: +price };
      }

      return null;
    })
    .filter((item): item is TypeAmount => item !== null);

  console.log('🚀 ~ getTypeAmounts ~ rawData:', rawData);

  // name(제휴 타입) 기준으로 value(가격) 누적 합산
  const result = Array.from(
    rawData.reduce((acc, { name, value }) => {
      acc.set(name, (acc.get(name) ?? 0) + value);
      return acc;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value }));

  return result;
};
