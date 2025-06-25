import { Header } from '@/components/atoms';
import Container from '@/components/containers/Container';
import StoreDetail from '@/components/estimate-store/StoreDetail';
import { use } from 'react';
import { getStoreDetail } from '@/lib/actions/StoreDetailActions';

type Props = {
  params: Promise<{ storeId: string }>;
};

export default function StoreId({ params }: Props) {
  const { storeId } = use(params);
  const details = use(getStoreDetail(Number(storeId)));
  if (!details?.id) return null;

  return (
    <Container
      className='px-0 pt-[65px] pb-[72.5px]'
      header={<Header leftIcon='back' rightIcon='close' />}
    >
      <StoreDetail {...details} />
    </Container>
  );
}
