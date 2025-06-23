'use server';

import prisma from '../db';

export type StoreDetailProps = {
  id: number;
  name: string;
  info: Record<string, string>;
  categoryId: number;
  // 1: 예식장 , 2: 스드메, 3: 신혼여행, 4: 가전가구 , 5: 예물
  options: Record<string, string>;
  images: string[]; // 이미지 배열
};

export const getStoreDetail = async (storeId: number) => {
  const detail = await prisma.partnerService.findUnique({
    where: {
      id: storeId, // partnerservice의 PK
    },
    select: {
      id: true,
      name: true,
      content: true, // JSON 필드
      image: true, // 이미지 필드
      Partner: {
        select: {
          name: true,
          PartnerCategory: {
            select: {
              id: true, // categoryid
            },
          },
        },
      },
    },
  });

  let images: string[] = [];
  if (Array.isArray(detail?.image)) {
    images = detail.image.filter(
      (item): item is string => typeof item === 'string'
    );
  }

  const info: Record<string, string> = {};
  const options: Record<string, string> = {};

  if (typeof detail?.content === 'object' && detail.content !== null) {
    for (const [key, value] of Object.entries(detail.content)) {
      if (typeof value === 'string') {
        info[key] = String(value);
      } else if (typeof value === 'number') {
        info[key] = `${value.toLocaleString('ko-KR')} 원`; // 숫자 형식으로 변환
      } else if (Array.isArray(value)) {
        options[key] = JSON.stringify(value); // 문자열로 변환해서 저장
      }
    }
  }

  const result: StoreDetailProps = {
    id: detail?.id || 0,
    name: detail?.name || '',
    info,
    categoryId: detail?.Partner?.PartnerCategory?.id || 1,
    options,
    images: detail?.image ? detail.image.toString().split(',') : [],
  };

  return result;
};

export const insertOptions = async (
  user_id: number,
  partner_service_id: number,
  options?: Record<string, string>,
  state: number = 0
) => {
  return await prisma.budgetPlan.upsert({
    where: {
      user_id_partner_service_id: {
        user_id,
        partner_service_id,
      },
    },
    update: {
      selected: options,
      state: state,
    },
    create: {
      user_id,
      partner_service_id,
      selected: options,
      state: state,
    },
  });
};
