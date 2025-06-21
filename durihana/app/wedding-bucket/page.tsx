import WeddingBucket from '@/components/weddingbucket/WeddingBucket';
import { use } from 'react';
import { getBucketList } from '@/lib/actions/StoreActions';
import { auth } from '@/lib/auth';

export default function WeddingBucketPage() {
  const session = use(auth());
  if (!session || !session.user) {
    return <div>로그인이 필요해요</div>;
  }
  const bucketList = use(getBucketList(parseInt(session.user.id || '0', 10)));

  if (!bucketList || bucketList.length === 0) {
    return <div>No items in the bucket list.</div>;
  }
  return (
    <div>
      <WeddingBucket items={bucketList} />
    </div>
  );
}
