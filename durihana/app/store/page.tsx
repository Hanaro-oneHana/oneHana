import { Header } from '@/components/atoms';
import BottomNavigation from '@/components/atoms/BottomNavigation';
import StoreComponent from '@/components/store/Store';
import { use } from 'react';
import { getStoreList } from '@/lib/actions/StoreActions';

type SearchParams = Promise<{
  search?: string;
  category?: string;
}>;

export default function StorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search, category } = use(searchParams);

  const storeList = use(
    getStoreList(search || '', parseInt(category || '1', 10))
  );

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
