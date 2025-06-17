'use client'

import Button from "@/components/atoms/Button";
import Header from "@/components/atoms/Header";
import InputComponent from "@/components/atoms/InputComponent";
import Txt from "@/components/atoms/Txt";
import { createAction } from "@/lib/actions/CreateActions";
import { credentialValidator } from "@/lib/validator";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import type React from 'react';


export default function signup() {
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
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    
    const router = useRouter()
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        getUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    return <>
        <Header leftIcon = "back" title="회원가입" />
        <form action={createAction}>
            <div>
                <Txt className="font-[500] text-[16px] mt-[40px] ml-[25px]">이름</Txt>
                <InputComponent width="w-[325px]" className={inputSet} placeholder="이름을 입력해 주세요"
                    name="name" value={userInfo.name} onChange={handleChange}/>
                <Txt className={errMasseage}/>
            </div>

            <div>
                <Txt className={title}>이메일</Txt>
                <InputComponent className={inputSet} placeholder="abc@durihana.com"
                    type="email" name="email" value={userInfo.email} onChange={handleChange}/>
                <Txt className="text-red text-[8px] mt-[3px] ml-[25px]" >{emailValidator.success ? " " : "*이메일형식이 올바르지 않습니다"}</Txt>
            </div>
            
            <div>
                <Txt className={title}>비밀번호</Txt>
                <InputComponent className={inputSet} placeholder="8자 이상 입력해 주세요"
                    type="password" name="password" value={userInfo.password} onChange={handleChange}/>
                <Txt className={errMasseage}>{userInfo.password.length >= 8 ? ' ' : ' *8자 이상 입력해주세요 '}</Txt>
            </div>
            
            <div>
                <Txt className={title}>비밀번호 확인</Txt>
                <InputComponent className={inputSet} placeholder="8자 이상 입력해 주세요"
                    type="password" name="passwordCheck" value={userInfo.passwordCheck} onChange={handleChange}/>
                <Txt className={errMasseage}>{userInfo.password === userInfo.passwordCheck ? ' ' : '*비밀번호가 일치하지 않습니다'}</Txt>
            </div>

            <div>
                <Txt className={title}>전화번호</Txt>
                <InputComponent className={inputSet} placeholder="010-12324-1234"
                    name="phone" value={userInfo.phone} onChange={handleChange}/>
                <Txt className={errMasseage}/>
            </div>

            <div>
                <Txt className={title}>결혼예정일</Txt>
                <InputComponent className={inputSet} placeholder="2026-01-01"
                    type="date" name="marriageDate" value={userInfo.marriageDate} onChange={handleChange}/>
            </div>
            
            <Button type="submit" className="w-[335px] h-[48px] block mx-auto mt-[76px] font-[500]" >완료</Button>
            
            {status === 'success' && (
                <p>성공</p>
            )}
            {status === 'error' && (
                <p>오류발생</p>
            )}
        </form>
    </>;
}
