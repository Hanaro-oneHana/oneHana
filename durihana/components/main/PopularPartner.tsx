import Image from 'next/image';
import { HorizontalSlider, Txt } from '../atoms';

export default function PopularPartner() {
  const partners = [
    { label: '예식장', img: '/asset/images/weddinghall-popular.png' },
    { label: '신혼여행', img: '/asset/images/tour-popular.png' },
    { label: '스튜디오', img: '/asset/images/studio-popular.png' },
    { label: '드레스', img: '/asset/images/dress-popular.png' },
    { label: '가전', img: '/asset/images/electronic-popular.png' },
    { label: '가구', img: '/asset/images/furniture-popular.png' },
    { label: '예물', img: '/asset/images/ring-popular.png' },
  ];

  return (
    <>
      <div>
        <Txt size='text-[18px]' weight='font-[500]'>
          인기 제휴처
        </Txt>
      </div>
      <HorizontalSlider>
        <div className='flex gap-x-[10px] mt-[17px]'>
          {partners.map((partner) => (
            <div key={partner.label} className='flex flex-col items-center'>
              <Txt size='text-[12px]'>{partner.label}</Txt>
              <Image
                src={partner.img}
                alt={partner.label}
                width={90}
                height={120}
                className='mt-[4px]'
              />
            </div>
          ))}
        </div>
      </HorizontalSlider>
    </>
  );
}
