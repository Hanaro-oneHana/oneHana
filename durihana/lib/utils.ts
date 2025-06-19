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

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = targetDate.getTime() - today.getTime(); // 밀리초 차이
  console.log('🚀 ~ calculateDday ~ diff:', diff);
  const dDay = Math.floor(diff / (1000 * 60 * 60 * 24)); // 일 수로 변환

  return dDay;
};
