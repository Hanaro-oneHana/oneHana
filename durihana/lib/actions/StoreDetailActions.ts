'use server';

import prisma from '../db';

export type StoreDetailProps = {
  id: number;
  name: string;
  info: Record<string, string>;
  type: string; // '예식장', '스드메', '여행'
  options: Record<string, string>;
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
      Partner: {
        select: {
          name: true,
          PartnerCategory: {
            select: {
              type: true, // '예식장', '스드메', '여행' 중 하나
            },
          },
        },
      },
    },
  });

  const info: Record<string, string> = {};
  const options: Record<string, string> = {};

  if (typeof detail?.content === 'object' && detail.content !== null) {
    for (const [key, value] of Object.entries(detail.content)) {
      if (typeof value === 'string') {
        //나중에 value 도 다 string 되면 type number 제거
        info[key] = String(value);
      } else if (typeof value === 'number') {
        info[key] = `${value.toLocaleString('ko-KR')} 원`; // 숫자 형식으로 변환
      } else if (Array.isArray(value)) {
        //배열인 JSON 만 옵션으로 처리
        options[key] = JSON.stringify(value); // 문자열로 변환해서 저장
      }
    }
  }

  const result: StoreDetailProps = {
    id: detail?.id || 0,
    name: detail?.name || '',
    info,
    type: detail?.Partner?.PartnerCategory?.type || '',
    options,
  };

  console.log(result);
  return result;
};

export const insertOptions = async (
  user_id: number,
  partner_service_id: number,
  options?: Record<string, string>
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
    },
    create: {
      user_id,
      partner_service_id,
      selected: options,
    },
  });
};
