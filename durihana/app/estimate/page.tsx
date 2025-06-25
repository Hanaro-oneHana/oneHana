import { EstimateMain } from '@/components/estimate-store';
import { use } from 'react';
import { getStoreList } from '@/lib/actions/StoreActions';

type SearchParams = Promise<{
  search?: string;
  category?: string;
}>;

export default function EstimatePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search, category } = use(searchParams);
  const storeList = use(
    getStoreList(search || '', parseInt(category || '0', 10))
  );
  return (
    <EstimateMain
      storeList={storeList}
      categoryId={parseInt(category || '0', 10)}
    />
  );
}
