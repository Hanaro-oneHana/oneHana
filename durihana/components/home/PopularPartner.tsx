import { HorizontalSlider, Txt } from '@/components/atoms';
import { partners } from '@/constants/store';
import Image from 'next/image';

export default function PopularPartner() {
  return (
    <div className='flex w-full flex-col items-start gap-[17px]'>
      <div>
        <Txt size='text-[18px]' weight='font-[500]'>
          인기 제휴처
        </Txt>
      </div>
      <HorizontalSlider>
        <div className='flex gap-[10px]'>
          {partners.map((partner) => (
            <div key={partner.label} className='flex flex-col items-center'>
              <Txt size='text-[12px]'>{partner.label}</Txt>
              <Image
                src={partner.img}
                alt={partner.label}
                width={90}
                height={120}
                className='mt-[4px] rounded-[10px]'
              />
            </div>
          ))}
        </div>
      </HorizontalSlider>
    </div>
  );
}
