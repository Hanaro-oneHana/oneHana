// /Users/kun/workspace/oneHana/durihana/app/auth/signup/page.tsx
'use client'

import Button from "@/components/atoms/Button";
import Header from "@/components/atoms/Header";
import InputComponent from "@/components/atoms/InputComponent";
import Txt from "@/components/atoms/Txt";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";



export default function signup() {
    const title = "text-[16px] mt-[11px] ml-[25px] font-[500]";
    const inpuSet = "mt-[10px] ml-[25px] w-[325px] text-[14px] font-[600] block mx-auto text-primarycolor";
    const errMasseage = "text-[8px] text-secondaycolor mt-[3px] ml-[25px] ";
    // name, email, password, password confrim, phoneN, Mdate
    // start txt position 40,25
    // 10 txt-input group
    // 30 input - txt
    // input -> other txt 30px
    // input font size -> 14px, hana 2.0 B-title 500,  button, C-input 600
    //weight='font-[600]' -> 
    
    const [userInfo, getUserInfo] = useState({
        name: '',
        email: '',
        password: '',
        passwordCheck: '',
        phone: '',
        marriageDate: '',
    });

    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        getUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const router = useRouter();
    const handleSubmit = async () => {

        if (userInfo.password !== userInfo.passwordCheck) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const formData = new FormData();
        formData.append('name', userInfo.name);
        formData.append('email', userInfo.email);
        formData.append('password', userInfo.password);
        formData.append('phone', userInfo.phone);
        formData.append('marriageDate', userInfo.marriageDate);

        try {
            const res = await fetch("/api/CreateUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    password: userInfo.password,
                    phone: userInfo.phone,
                    marriageDate: userInfo.marriageDate,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || "회원가입 실패")
                setStatus("success");
            } 
        catch (err) {
            console.error(err);
            setStatus("error");
        }
    };    
    
    // check input form
    // const formCheck = userInfo.password === userInfo.passwordCheck;
    // const [rightWritten, wrongWritten] = useReducer((check) => !check, false);  // show message for each input
    // if( userInfo.password === userInfo.passwordCheck ) wrongWritten();  
    /// disabled = {!formCheck} onClick = {}

    // app/signup/page.tsx
    
    return <>
        <Header leftIcon = "back" title="회원가입" />

        
        <Txt weight = 'font-[500]' className="text-[16px] mt-[40px] ml-[25px]">이름</Txt>
        <InputComponent width="w-[325px]" className={inpuSet} placeholder="이름을 입력해 주세요"
            name="name" value={userInfo.name} onChange={handleChange}/>
        <Txt className={errMasseage}/>
        
        <br/><Txt className={title}>이메일</Txt>
        <InputComponent className={inpuSet} placeholder="abc@durihana.com"
            name="email" value={userInfo.email} onChange={handleChange}/>
        <Txt className={errMasseage}>*이메일형식이 올바르지 않습니다</Txt>

        <br/><Txt className={title}>비밀번호</Txt>
        <InputComponent className={inpuSet} placeholder="8자 이상 입력해 주세요"
            name="password" value={userInfo.password} onChange={handleChange}/>
        <Txt className={errMasseage}>*8자 이상 입력해주세요</Txt>

        <br/><Txt className={title}>비밀번호 확인</Txt>
        <InputComponent className={inpuSet} placeholder="8자 이상 입력해 주세요"
            name="passwordCheck" value={userInfo.passwordCheck} onChange={handleChange}/>
        <Txt className={errMasseage}>*비밀번호가 일치하지 않습니다</Txt>

        <br/><Txt className={title}>전화번호</Txt>
        <InputComponent className={inpuSet} placeholder="010-12324-1234"
            name="phone" value={userInfo.phone} onChange={handleChange}/>
        <Txt className={errMasseage}/>

        <br/><Txt className={title}>결혼예정일</Txt>
        <InputComponent className={inpuSet} placeholder="2026-01-01"
            name="marriageDate" value={userInfo.marriageDate} onChange={handleChange}/>
        
        <Button  type="submit" onClick={handleSubmit} className="w-[335px] h-[48px] block mx-auto mt-[76px] font-[500]" >완료</Button>

        {status === 'success' && (
            <p>성공</p>
        )}
        {status === 'error' && (
            <p>오류발생</p>
        )}
    </>;
}