// /Users/kun/workspace/oneHana/durihana/app/auth/signup/page.tsx
'use client'

import Button from "@/components/atoms/Button";
import Header from "@/components/atoms/Header";
import InputComponent from "@/components/atoms/InputComponent";
import Txt from "@/components/atoms/Txt";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";



export default function signup() {
    const position = "mt-[30px] ml-[25px]";
    const inpuSet = "mt-[10px] ml-[25px] text-[14px]";
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

    // 버튼 클릭 시 FormData 만들어서 서버 액션 호출

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
     if (!res.ok || !data.success) throw new Error(data.error || "회원가입 실패");
     setStatus("success");
   } catch (err) {
     console.error(err);
     setStatus("error");
   }
    };    
    
    
    
    
    // check input form
    // const formCheck = userInfo.password === userInfo.passwordCheck;
    // const [rightWritten, wrongWritten] = useReducer((check) => !check, false);  // show message for each input
    // if( userInfo.password === userInfo.passwordCheck ) wrongWritten();  
    
    
    return <>
        <Header leftIcon = "back" title="회원가입"/>

        
        <Txt weight = 'font-[500]' className="mt-[40px] ml-[25px]">이름</Txt>
        <InputComponent width="w-[325px]" className="block mx-auto text-primarycolor" placeholder="이름"
            name="name" value={userInfo.name} onChange={handleChange}/>
        

        
        <Txt>이메일</Txt>
        <InputComponent name="email" value={userInfo.email} onChange={handleChange}/>
        <Txt>wrong email address</Txt><br/>

        <Txt>비밀번호</Txt>
        <InputComponent name="password" value={userInfo.password} onChange={handleChange}/>

        <Txt>비밀번호 확인</Txt>
        <InputComponent name="passwordCheck" value={userInfo.passwordCheck} onChange={handleChange}/>

        <Txt>전화번호</Txt>
        <InputComponent name="phone" value={userInfo.phone} onChange={handleChange}/>

        <Txt>결혼예정일</Txt>
        <InputComponent name="marriageDate" value={userInfo.marriageDate} onChange={handleChange}/>
        
        <Button  type="submit" onClick={handleSubmit} className="w-[335px] h-[48px] block mx-auto mt-[56px] font-[500]" >완료</Button>

        {status === 'success' && (
            <p>성공</p>
        )}
        {status === 'error' && (
            <p>오류발생</p>
        )}
    </>;
}
// disabled = {!formCheck} onClick = {}

// app/signup/page.tsx