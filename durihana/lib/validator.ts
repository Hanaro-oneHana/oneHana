import { z, ZodType } from 'zod';

const userValidator = {
    name: z.string().min(2, '*2자 이상 입력해 주세요'),
    email: z.string().nonempty().email('*이메일 형식이 올바르지 않습니다.'),
    password: z.string().nonempty().min(8, '*8자 이상 입력해 주세요'),
    phone: z.string().nonempty(),
    marriageDate: z.string().nonempty() //나중에 건들어야함
};

export const UserValidator = z.object(userValidator);
export type zinfer<T extends ZodType> = z.infer<T>;
