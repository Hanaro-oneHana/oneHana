export type Schedule = {
  id: number;
  title: string;
  date: Date;
  time: string;
  type: 'reservation' | 'finance';
  partnerName?: string;
  accountType?: number;
  amount?: number; // Account의 payment 필드에서 가져올 금액
};

export type ScheduleCardProps = {
  schedule: Schedule;
  keyPrefix: string;
};

export type ScheduleListProps = {
  loading: boolean;
  selectedDate: Date;
  reservationSchedules: Schedule[];
  financeSchedules: Schedule[];
};

export type ScheduleProps = {
  userId: number;
};

// 계좌 타입 정의 (Account 모델의 type과 동일)
export const ACCOUNT_TYPES = {
  0: '입출금',
  1: '예금',
  2: '적금',
  3: '대출',
} as const;

// 일정 제목 생성 함수
export const getScheduleTitle = (accountType: number, isExpiry = false) => {
  const baseTitle = ACCOUNT_TYPES[accountType as keyof typeof ACCOUNT_TYPES];

  if (isExpiry) {
    return `${baseTitle} 만료`;
  }

  switch (accountType) {
    case 2: // 적금
      return `${baseTitle} 납입`;
    case 3: // 대출
      return `${baseTitle} 상환`;
    case 1: // 예금
      return `${baseTitle} 만료`;
    default:
      return baseTitle;
  }
};

export type AccountType = keyof typeof ACCOUNT_TYPES;
