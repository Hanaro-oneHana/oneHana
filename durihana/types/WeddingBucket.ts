export type Option = {
  optionTitle: string;
  optionContent: string;
};

export type BucketItem = {
  id: number;
  store?: string;
  options?: Option[];
  price?: number;
  state?: number;
  category?: number;
  partnerServiceId: number;
};
