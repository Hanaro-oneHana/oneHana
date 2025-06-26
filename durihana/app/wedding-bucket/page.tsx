import { Header, Txt } from '@/components/atoms';
import Container from '@/components/containers/Container';
import WeddingBucket from '@/components/weddingbucket/WeddingBucket';
import { use } from 'react';
import { getBucketList } from '@/lib/actions/StoreActions';
import { auth } from '@/lib/auth';

export default function WeddingBucketPage() {
  const session = use(auth());

  const { isSuccess, data: bucketList } = use(
    getBucketList(
      session?.user?.isMain ? Number(session.user.id) : session?.user?.partnerId
    )
  );

  return (
    <Container
      className='gap-[30px] pt-[65px] pb-[40px]'
      header={<Header title='웨딩 버켓' leftIcon='back' rightIcon='close' />}
    >
      {isSuccess && bucketList ? (
        <WeddingBucket items={bucketList} />
      ) : (
        <Txt size='text-[14px]' className='text-icongray' align='text-center'>
          해당되는 상품이 없습니다.
        </Txt>
      )}
    </Container>
  );
}
