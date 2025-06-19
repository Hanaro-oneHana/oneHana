import { z, ZodType } from 'zod';

// 전화번호 -> 앞부분이 010 등의 번호구조인가 -> z.string().regex(/^[a-z]+$/);?
// 이름 -> 단순 초성이 아닌, 제대로 조합이 되있느냐
// 비밀번호 -> 8자 이상, 입력 없는 경우에도 안띄우게 -> 이건 걍 page서 해도 되려나?
// 비번확인 -> 비밀번호와 비교
// 결혼일 -> 과거 선택이면 에러나게 해야함 -> 실시간 날짜 어캐 가져오지
// gpt왈
// const date = z.iso.date();
// date.parse("2020-01-01");

// 가입 성공시, [이름]님 환영합니다! 떠서 견적짜기 안내창 가볍게 띄우기?
//
// nonempty -> "" false
// nullable -> "" true

const userValidator = {
    name: z.string().min(2, '*2자 이상 입력해 주세요'),
    email: z.string().nonempty().email('*이메일 형식이 올바르지 않습니다.'),
    password: z.string().nonempty().min(8, '*8자 이상 입력해 주세요'),
    phone: z.string().nonempty(),
    marriageDate: z.string().nonempty() //나중에 건들어야함
};

export const UserValidator = z.object(userValidator);
export type zinfer<T extends ZodType> = z.infer<T>;