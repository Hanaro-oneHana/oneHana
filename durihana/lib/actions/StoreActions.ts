'use server';

import prisma from '../db';

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
        },
      },
    },
  });

  return bucketList;
};
