import { EstimateMain } from '@/components/estimate-store';
import { use } from 'react';
import { getStoreList } from '@/lib/actions/StoreActions';

type Params = Promise<{
  search?: string;
  category?: string;
}>;

export default function EstimatePage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { search, category } = use(searchParams);
  const { isSuccess, data: storeList } = use(
    getStoreList(search || '', parseInt(category || '0', 10))
  );
  return (
    <EstimateMain
      storeList={isSuccess ? storeList : []}
      categoryId={parseInt(category || '0', 10)}
    />
  );
}
