'use client'

import { Button, Header, InputComponent, Txt } from "@/components/atoms";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";



export default function Singup() {
    const title = "text-[16px] mt-[11px] font-[500]";
    const inputSet = "mt-[10px] w-[325px] text-[14px] font-[600] block mx-auto text-primarycolor";
    const errMasseage = "text-red text-[8px] mt-[3px]";
    const normalGap = "mt-[30px] px-[20px]";
    const messageGap = "mt-[11px] px-[20px]";

    const phoneHyphen = (h: string) => {
        const digits = h.replace(/\D/g, "");
        
        if (digits.length < 4)  return digits;
        if (digits.length < 8)  return `${digits.slice(0, 3)}-${digits.slice(3)}`;

        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
    const dateHyphen = (h: string) => {
        const digits = h.replace(/\D/g, '').slice(0, 8);
        const len = digits.length;

        if (len < 5) {
            return digits;
        }
        if (len < 7) {
            return `${digits.slice(0, 4)}-${digits.slice(4)}`;
        }
        return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    };

    const[formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordCheck: '',
        phone: '',
        marriageDate: ''
    });
    const[error, setError ] = useState('');
    const[success, setSuccess] = useState('');
    const[isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if(formData.password !==formData.passwordCheck) {
            setError('비밀번호가 일치하지 않습니다.');
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    marriageDate: formData.marriageDate,
                }),
            });

            const data = await response.json();

            if(!response.ok)    setError(data.error || '회원가입에 오류가 발새했습니다.');
            else                setSuccess('회원가입이 완료되었습니다.');
        }
        catch (error) {
            setError('오류가 발생했습니다.');
        }
        finally {
            setIsLoading(false);
        }
    };
    
    const handleInput = (e:ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const valCheck = name === "phone" ? phoneHyphen(value) : name === "marriageDate" ? dateHyphen(value) : value;
        setFormData((prev) => ({
            ...prev,
            [name]: valCheck,
        }));
    };

    return <>
        <Header title="회원가입" leftIcon="back"/>

        <form onSubmit={handleSubmit} >
            <div className="mt-[100px] px-[20px]">
                <Txt className={title} >이름</Txt>
                <InputComponent className={inputSet} type="text" name="name" placeholder="이름을 입력해 주세요" value={formData.name} onChange={handleInput} required maxLength={25}/>
            </div>

            <div className={messageGap}>
                <Txt className={title} >이메일</Txt>
                <InputComponent className={inputSet} type="email" name="email" placeholder="abc@durihana.com" value={formData.email} onChange={handleInput} required/>
                {/* {error && ( <Txt className={errMasseage}>{error}</Txt>)} */}
                
            </div>

            <div className={messageGap}>
                <Txt className={title} >비밀번호</Txt>
                <InputComponent className={inputSet} type="password" name="password" placeholder="8자 이상을 입력해 주세요" value={formData.password} onChange={handleInput} required/>
            </div>

            <div className={messageGap}>
                <Txt className={title} >비밀번호 확인</Txt>
                <InputComponent className={inputSet} type="password" name="passwordCheck" placeholder="8자 이상을 입력해 주세요" value={formData.passwordCheck} onChange={handleInput} required/>
            </div>

            <div className={messageGap}>
                <Txt className={title} >전화번호</Txt>
                <InputComponent className={inputSet} type="text" name="phone" placeholder="010-1234-1234" value={formData.phone} onChange={handleInput} required/>
            </div>

            <div className={normalGap}>
                <Txt className={title} >예정 결혼일</Txt>
                <InputComponent className={inputSet} type="text" name="marriageDate" placeholder="2027-01-01" value={formData.marriageDate} onChange={handleInput} required/>
            </div>

            <div className="px-[20px]">
            <Button type="submit" className="block w-full mt-[76px]" disabled={isLoading} >{isLoading ? '가입중' : '완료'}</Button>
            </div>
        </form>
    </>;
}