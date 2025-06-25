export type SubAccount = {
  type: 1 | 2 | 3; // 1:예금, 2:적금, 3:대출
  balance: number;
};

export type MainAccount = {
  type: 0;
  account: string;
  balance: number;
};
