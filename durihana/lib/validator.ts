import { z } from 'zod';

export const signInValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userValidator = z.object({
  name: z.string().min(2, '*2자 이상 입력해 주세요'),
  email: z.string().nonempty().email('*이메일 형식이 올바르지 않습니다.'),
  password: z.string().nonempty().min(8, '*8자 이상 입력해 주세요'),
  phone: z
    .string()
    .nonempty('*휴대폰 번호를 입력해 주세요')
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, '*휴대폰 번호 형식이 올바르지 않습니다.'),
  marriageDate: z
    .string()
    .nonempty('*결혼 예정일을 입력해 주세요')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '*결혼 예정일 형식이 올바르지 않습니다.'),
});
