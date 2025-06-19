import { Header } from '@/components/atoms';
import StoreDetail from '@/components/store/StoreDetail';
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
    <>
      <Header leftIcon='back' rightIcon='close' />
      <StoreDetail {...details}></StoreDetail>
    </>
  );
}
