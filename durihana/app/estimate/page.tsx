import EstimateMain from '@/components/estimate/EstimateMain';
import { getStoreList } from '@/lib/actions/StoreActions';

type SearchParams = Promise<{
  search?: string;
  category?: string;
}>;

export default async function EstimatePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const storeList = await getStoreList(
    params.search || '',
    parseInt(params.category || '0', 10)
  );
  return (
    <EstimateMain
      storeList={storeList}
      categoryId={parseInt(params.category || '0', 10)}
    />
  );
}
