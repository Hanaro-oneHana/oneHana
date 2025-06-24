import WeddingBucket from '@/components/weddingbucket/WeddingBucket';
import { use } from 'react';
import { getBucketList } from '@/lib/actions/StoreActions';
import { auth } from '@/lib/auth';

export default function WeddingBucketPage() {
  const session = use(auth());
  if (!session || !session.user) {
    return <div>로그인이 필요해요</div>;
  }

  const bucketList = use(
    getBucketList(
      session.user.isMain ? Number(session.user.id) : session.user.partnerId
    )
  );

  return (
    <div>
      <WeddingBucket items={bucketList} />
    </div>
  );
}
