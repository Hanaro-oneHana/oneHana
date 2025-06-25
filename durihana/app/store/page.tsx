import { Header, BottomNavigation } from '@/components/atoms';
import Container from '@/components/containers/Container';
import StoreComponent from '@/components/estimate-store/Store';
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
    <Container
      className='px-0 pt-[65px] pb-[72.5px]'
      header={<Header leftIcon='my' rightIcon='bell' />}
      footer={<BottomNavigation selectedItem='store' />}
    >
      <StoreComponent
        storeList={storeList}
        categoryId={parseInt(category || '1', 10)}
      />
    </Container>
  );
}
