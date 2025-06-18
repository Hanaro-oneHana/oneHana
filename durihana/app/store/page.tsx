import { Header } from '@/components/atoms';
import BottomNavigation from '@/components/atoms/BottomNavigation';
import StoreComponent from '@/components/store/Store';
import { getStoreList } from '@/lib/actions/StoreActions';

type SearchParams = Promise<{
  search?: string;
  category?: string;
}>;

export default async function StorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search, category } = await searchParams;

  const storeList = await getStoreList(
    search || '',
    parseInt(category || '1', 10)
  );

  console.log('Store List:', storeList);

  return (
    <>
      <Header leftIcon='my' rightIcon='bell' />
      <StoreComponent
        storeList={storeList}
        categoryId={parseInt(category || '1', 10)}
      />
      <BottomNavigation selectedItem='store' />
    </>
  );
}
