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
  const { search, category } = await searchParams;
  const storeList = await getStoreList(
    search || '',
    parseInt(category || '0', 10)
  );
  return (
    <EstimateMain
      storeList={storeList}
      categoryId={parseInt(category || '0', 10)}
    />
  );
}
