import {
  WeddingHallContent,
  SDMContent,
  HoneymoonContent,
} from '@/lib/storeTypes';
import { formatKRWUnit } from '../asset/ProgressBar';
import { Txt } from '../atoms';
import { StoreDetailProps } from './StoreDetail';

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className='flex flex-row justify-between items-center'>
    <Txt size='text-[15px]' weight='font-[500]'>
      {label}
    </Txt>
    <Txt size='text-[14px]' weight='font-[500]'>
      {value}
    </Txt>
  </div>
);

export default function StoreInfo(details: StoreDetailProps) {
  let content = details?.content;
  const type = details?.partner?.partnercategory?.type;

  let contentBody;

  if (type === '예식장') {
    const c = content as WeddingHallContent;

    contentBody = (
      <div className='flex flex-col gap-[10px] px-[20px] overflow-hidden'>
        <Txt size='text-[7px]' color='text-textgray' className='text-right'>
          ※ 예상가는 성수기 주말 기준으로 책정됩니다
        </Txt>
        <InfoRow label='예상가격' value={formatKRWUnit(c.가격)} />
        <InfoRow
          label='수용인원'
          value={`${c.최소보증인원}명 ~ ${c.최대수용인원}명`}
        />
      </div>
    );
  } else if (type === '스드메') {
    const c = content as SDMContent;

    contentBody = (
      <div className='flex flex-col mt-[10px] gap-[30px] px-[20px]'>
        <InfoRow label='예상가격' value={formatKRWUnit(c.가격)} />
      </div>
    );
  } else if (type === '여행') {
    const c = content as HoneymoonContent;

    contentBody = (
      <div className='flex flex-col mt-[10px] gap-[30px] px-[20px]'>
        <InfoRow label='예상가격' value={formatKRWUnit(c.가격)} />
        <InfoRow label='여행지' value={c.여행지} />
        <InfoRow label='기간' value={c.기간} />
        <InfoRow label='숙소' value={c.숙소} />
        <InfoRow label='항공사' value={c.항공사} />
      </div>
    );
  }

  return contentBody;
}
