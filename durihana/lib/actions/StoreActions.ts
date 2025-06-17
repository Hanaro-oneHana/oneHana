'use server';

import prisma from '../db';

export type Store = {
  id: number;
  name: string;
  location: string;
  price: number;
  categoryId: number;
  popular: number;
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
      Partner: {
        select: {
          id: true,
          partner_category_id: true,
        },
      },
      BudgetPlan: {
        select: {
          id: true,
        },
      },
    },
  });

  const computePrice = (content: unknown): number => {
    if (typeof content === 'object' && content !== null) {
      if ('가격' in content) {
        return parseInt(content['가격']?.toString() || '0');
      }
      return 0;
    }
    return 0;
  };

  const result: Store[] = stores.map((store) => ({
    id: store.id,
    name: store.name,
    price: computePrice(store.content),
    location:
      typeof store.content === 'object' && store.content !== null
        ? '위치' in store.content
          ? store.content['위치']?.toString() || ''
          : ''
        : '',
    categoryId: store.Partner.partner_category_id,
    popular: store.BudgetPlan.length,
  }));

  return result.sort((a, b) => a.price - b.price);
};
