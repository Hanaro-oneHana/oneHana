export const domesticRegions = [
  '서울',
  '경기도',
  '인천',
  '강원도',
  '대전',
  '세종',
  '충청도',
  '광주',
  '전라도',
  '대구',
  '부산',
  '울산',
  '경상도',
  '제주도',
];

export const foreignRegions = [
  '추천 여행지',
  '국내',
  '아시아',
  '유럽',
  '미주',
  '오세아니아',
  '기타',
];

export type PriceOption = {
  label: string;
  value: number;
};

export const weddinghallPriceOptions: PriceOption[] = [
  { label: '전체', value: 0 },
  { label: '~ 300만원', value: 300 },
  { label: '~ 1000만원', value: 1000 },
  { label: '~ 1500만원 ', value: 1500 },
  { label: '1500만원 ~', value: 2000 },
];
export const sdmPriceOptions: PriceOption[] = [
  { label: '전체', value: 0 },
  { label: '~ 100만원', value: 100 },
  { label: '~ 300만원', value: 300 },
  { label: '~ 500만원', value: 500 },
  { label: '500만원 ~', value: 500 },
];

export const honeyMoonPriceOptions: PriceOption[] = [
  { label: '전체', value: 0 },
  { label: '~ 100만원', value: 100 },
  { label: '~ 300만원', value: 300 },
  { label: '~ 500만원', value: 500 },
  { label: '~ 1000만원', value: 1000 },
  { label: '1000만원 ~', value: 1000 },
];

export const electronicPriceOptions: PriceOption[] = [
  { label: '전체', value: 0 },
  { label: '~ 50만원', value: 50 },
  { label: '~ 100만원', value: 100 },
  { label: '~ 200만원', value: 200 },
  { label: '~ 300만원', value: 300 },
  { label: '~ 400만원', value: 400 },
  { label: '~ 500만원', value: 500 },
  { label: '500만원 ~', value: 500 },
];

export const weddingGiftPriceOptions: PriceOption[] = [
  { label: '전체', value: 0 },
  { label: '~ 50만원', value: 50 },
  { label: '~ 100만원', value: 100 },
  { label: '~ 200만원', value: 200 },
  { label: '~ 300만원', value: 300 },
  { label: '~ 400만원', value: 400 },
  { label: '~ 500만원', value: 500 },
  { label: '500만원 ~', value: 500 },
];
