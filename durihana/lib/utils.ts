import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const formatDisplayDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

export const calculateDday = (date: string) => {
  const now = formatDate(new Date());

  const targetDate = new Date(date);
  const today = new Date(now);

  if (isNaN(targetDate.getTime())) {
    return null;
  }

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = targetDate.getTime() - today.getTime(); // 밀리초 차이
  const dDay = Math.floor(diff / (1000 * 60 * 60 * 24)); // 일 수로 변환

  return dDay;
};

export function formatKRWUnit(amount: number) {
  if (amount < 10000) {
    return `${Math.floor(amount)}원`;
  }
  if (amount < 10000000) {
    return `${Math.floor(amount / 10000)}만원`;
  }

  const parts: string[] = [];

  const 억 = Math.floor(amount / 100000000);
  const 천 = Math.floor((amount % 100000000) / 10000000);
  const 백 = Math.floor((amount % 10000000) / 1000000);
  const 만 = Math.floor((amount % 1000000) / 10000);

  if (억 > 0) parts.push(`${억}억`);
  if (천 > 0) parts.push(`${천}천`);
  if (백 > 0) parts.push(`${백}백`);
  if (억 === 0 && 천 === 0 && 백 === 0 && 만 > 0) parts.push(`${만}`);

  const lastIndex = parts.length - 1;

  if (!(parts.length === 1 && parts[0].includes('억'))) {
    parts[lastIndex] += '만원';
  }

  return parts.join(' ');
}
