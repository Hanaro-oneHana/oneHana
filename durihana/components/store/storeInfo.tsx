import { JsonValue } from '@/lib/generated/prisma/runtime/library';
import {
  WeddingHallContent,
  SDMContent,
  HoneymoonContent,
} from '@/lib/storeTypes';
import { formatKRWUnit } from '../asset/ProgressBar';
import { Txt } from '../atoms';

type Props = {
  name: string;
  content: JsonValue;
  partner: {
    address: string;
    partnercategory: {
      type: string;
    };
  };
};

export default function StoreInfo(details: Props | null) {
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

        <div className='flex flex-row justify-between items-center'>
          <Txt size='text-[15px]' weight='font-[500]'>
            예상가격
          </Txt>
          <Txt size='text-[14px]' weight='font-[500]'>
            {formatKRWUnit(c.가격)}
          </Txt>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <Txt size='text-[15px]' weight='font-[500]'>
            수용인원
          </Txt>
          <Txt size='text-[14px]' weight='font-[500]'>
            {c.최소보증인원}명 ~ {c.최대수용인원}명
          </Txt>
        </div>
      </div>
    );
  } else if (type === '스드메') {
    const c = content as SDMContent;

    contentBody = (
      <div className='flex flex-col mt-[10px] gap-[30px] px-[20px]'>
        <div className='flex flex-row justify-between items-center'>
          <Txt size='text-[15px]' weight='font-[500]'>
            예상가격
          </Txt>
          <Txt size='text-[14px]' weight='font-[500]'>
            {formatKRWUnit(c.가격)}
          </Txt>
        </div>
      </div>
    );
  } else if (type === '여행') {
    const c = content as HoneymoonContent;

    contentBody = (
      <div className='flex flex-col mt-[10px] gap-[30px] px-[20px]'>
        <div className='flex flex-row justify-between items-center'>
          <Txt size='text-[15px]' weight='font-[500]'>
            예상가격
          </Txt>
          <Txt size='text-[14px]' weight='font-[500]'>
            {formatKRWUnit(c.가격)}
          </Txt>
        </div>

        <div className='flex flex-row justify-between items-center'>
          <Txt size='text-[15px]' weight='font-[500]'>
            여행지
          </Txt>
          <Txt size='text-[14px]' weight='font-[500]'>
            {c.여행지}
          </Txt>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <Txt size='text-[15px]' weight='font-[500]'>
            기간
          </Txt>
          <Txt size='text-[14px]' weight='font-[500]'>
            {c.기간}
          </Txt>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <Txt size='text-[15px]' weight='font-[500]'>
            숙소
          </Txt>
          <Txt size='text-[14px]' weight='font-[500]'>
            {c.숙소}
          </Txt>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <Txt size='text-[15px]' weight='font-[500]'>
            항공사
          </Txt>
          <Txt size='text-[14px]' weight='font-[500]'>
            {c.항공사}
          </Txt>
        </div>
      </div>
    );
  }

  return contentBody;
}
