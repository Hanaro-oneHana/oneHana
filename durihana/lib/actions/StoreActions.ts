'use server';

import { BucketItem } from '@/components/weddingbucket/WeddingBucket';
import prisma from '../db';

export interface UpdateBudgetPlanPayload {
  state: number; // 0:예약, 1:예약완료, 2:결제, 3:결제완료
  selected?: {
    // 예약할 때만 채워줄 selected 옵션
    date: string; // Calendar에서 선택한 date.toISOString()
    time: string; // Calendar에서 선택한 “HH:mm” format
  };
}

export type Store = {
  id: number;
  name: string;
  location: string;
  price: number;
  images?: string[];
  destination: string;
  modelId: string;
  categoryId: number;
};

export const getStoreList = async (search: string, category: number) => {
  const stores = await prisma.partnerService.findMany({
    where: {
      name: {
        contains: search,
      },
      Partner: {
        is: {
          partner_category_id: category,
        },
      },
    },
    select: {
      id: true,
      name: true,
      content: true,
      image: true,
      Partner: {
        select: {
          id: true,
          partner_category_id: true,
        },
      },
    },
  });

  const result: Store[] = stores.map((store) => ({
    id: store.id,
    name: store.name,
    images: store.image?.toString().split(',') || [],
    price:
      typeof store.content === 'object' &&
      store.content !== null &&
      '가격' in store.content
        ? parseInt(store.content['가격']?.toString() || '0')
        : 0,
    location:
      typeof store.content === 'object' && store.content !== null
        ? '위치' in store.content
          ? store.content['위치']?.toString() || ''
          : ''
        : '',
    destination:
      typeof store.content === 'object' && store.content !== null
        ? '여행지' in store.content
          ? store.content['여행지']?.toString() || ''
          : ''
        : '',
    modelId:
      typeof store.content === 'object' && store.content !== null
        ? '모델명' in store.content
          ? store.content['모델명']?.toString() || ''
          : ''
        : '',
    categoryId: store.Partner.partner_category_id,
  }));

  return result.sort((a, b) => a.price - b.price);
};

export const getBucketList = async (userId: number) => {
  const bucketList = await prisma.budgetPlan.findMany({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
      partner_service_id: true,
      selected: true,
      state: true,
      PartnerService: {
        select: {
          id: true,
          name: true,
          content: true, // JSON 필드
          Partner: {
            select: {
              partner_category_id: true,
            },
          },
        },
      },
    },
  });

  const result: BucketItem[] = bucketList.map((item) => ({
    id: item.id,
    store: item.PartnerService.name,
    partnerServiceId: item.partner_service_id,
    options: item.selected
      ? Object.entries(item.selected).map(([key, value]) => ({
          optionTitle: key,
          optionContent: value,
        }))
      : [],
    price:
      item.PartnerService.content &&
      typeof item.PartnerService.content === 'object' &&
      item.PartnerService.content !== null
        ? parseInt(
            (item.PartnerService.content as Record<string, string>)[
              '가격'
            ]?.toString() || '0'
          )
        : 0,
    state: item.state !== null ? item.state : 0,
    category: item.PartnerService.Partner.partner_category_id,
  }));

  return result.sort((a, b) => (a.category ?? 0) - (b.category ?? 0));
};

export const deleteBucketItem = async (id: number) => {
  try {
    await prisma.budgetPlan.delete({
      where: {
        id: id,
      },
    });
    return true;
  } catch (error) {
    console.error('아이템 삭제 중 오류 발생', error);
    return false;
  }
};

export const updateBudgetPlan = async (
  budgetPlanId: number,
  state: number
): Promise<void> => {
  await prisma.budgetPlan.update({
    where: { id: budgetPlanId },
    data: { state },
  });
};
