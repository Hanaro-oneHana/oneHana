'use client'

import { Button, Header, InputComponent, Txt } from "@/components/atoms";
import { createAction } from "@/lib/actions/CreateActions";
import { credentialValidator } from "@/lib/validator";
import { ChangeEvent, FormEvent, useState } from "react";
import type React from 'react';


export default function SignUp() {
    const title = "text-[16px] mt-[11px] ml-[25px] font-[500]";
    const inputSet = "mt-[10px] ml-[25px] w-[325px] text-[14px] font-[600] block mx-auto text-primarycolor";
    const errMasseage = "text-red text-[8px] mt-[3px] ml-[25px]";

    const [userInfo, getUserInfo] = useState({
        name: '',
        email: '',
        password: '',
        passwordCheck: '',
        phone: '',
        marriageDate: '',
    });
    const emailValidator = credentialValidator.safeParse({email: userInfo.email});
    const [status, setStatus] = useState<"idle" | "success" | "error" | "inputError">("idle");
    
    const phoneHyphen = (h: string) => {
        const digits = h.replace(/\D/g, "");
        
        if (digits.length < 4)  return digits;
        if (digits.length < 8)  return `${digits.slice(0, 3)}-${digits.slice(3)}`;

        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }

    const handdleSubmit = (e: FormEvent<HTMLFormElement>) => {
        if(Object.values(userInfo).some((v) => v.trim() === '')) {
            e.preventDefault();
            setStatus('inputError');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const valueCheck = name === "phone" ? phoneHyphen(value) : value;

        getUserInfo((prev) => ({ ...prev, [name]: valueCheck }));
    };

    return <>
        <Header leftIcon='back' title="회원가입" />
        <form action={createAction} onSubmit={handdleSubmit}>
            <div>
                <Txt className="font-[500] text-[16px] mt-[40px] ml-[25px]">이름</Txt>
                <InputComponent width="w-[325px]" className={inputSet} placeholder="이름을 입력해 주세요"
                    name="name" value={userInfo.name} onChange={handleChange}/>
                <Txt className={errMasseage}>{status === 'inputError' && userInfo.name.trim() === '' ? '*이름을 입력해 주세요.' : ''} </Txt>
            </div>

            <div>
                <Txt className={title}>이메일</Txt>
                <InputComponent className={inputSet} placeholder="abc@durihana.com"
                    type="email" name="email" value={userInfo.email} onChange={handleChange}/>
                <Txt className={errMasseage} >{status === 'inputError' && userInfo.email.trim() === '' ? '*이메일을 입력해 주세요' 
                : !emailValidator.success && userInfo.email.length > 0 ? ' *이메일형식이 올바르지 않습니다 ' : ''}</Txt>
            </div>
            
            <div>
                <Txt className={title}>비밀번호</Txt>
                <InputComponent className={inputSet} placeholder="8자 이상 입력해 주세요"
                    type="password" name="password" value={userInfo.password} onChange={handleChange}/>
                <Txt className={errMasseage}>{status === 'inputError' && userInfo.password.trim() === '' ? '*비밀번호를 입력해 주세요' 
                : userInfo.password.length > 0 && userInfo.password.length < 8 ? ' *8자 이상 입력해주세요 ' : ''}</Txt>
            </div>
            
            <div>
                <Txt className={title}>비밀번호 확인</Txt>
                <InputComponent className={inputSet} placeholder="8자 이상 입력해 주세요"
                    type="password" name="passwordCheck" value={userInfo.passwordCheck} onChange={handleChange}/>
                <Txt className={errMasseage}>{status === 'inputError' && userInfo.passwordCheck.trim() === '' ? '*비밀번호를 다시 입력해 주세요' 
                : userInfo.password !== userInfo.passwordCheck && userInfo.passwordCheck.length > 0  ? ' *비밀번호가 일치하지 않습니다 ' : ''}</Txt>
            </div>

            <div>
                <Txt className={title}>전화번호</Txt>
                <InputComponent className={inputSet} placeholder="010-12324-1234"
                    name="phone" value={userInfo.phone} onChange={handleChange} maxLength={13} />
                <Txt className={errMasseage}>{status === 'inputError' && userInfo.phone.trim() === '' ? '*전화번호를 입력해 주세요' : ''}</Txt>
            </div>

            <div>
                <Txt className={title}>결혼예정일</Txt>
                <InputComponent className={inputSet} 
                    type="date" name="marriageDate" value={userInfo.marriageDate} onChange={handleChange}/>
                <Txt className={errMasseage}>{status === 'inputError' && userInfo.marriageDate.trim() === '' ? '*결혼예정일을 입력해 주세요' : ''}</Txt>
            </div>
            
            <Button type="submit" className="w-[335px] h-[48px] block mx-auto mt-[76px] font-[500]" >완료</Button>
        </form>
    </>;
}