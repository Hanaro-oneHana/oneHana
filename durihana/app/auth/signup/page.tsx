'use client';

import AlertModal from '@/components/alert/AlertModal';
import { Button, Header, InputComponent, Txt } from '@/components/atoms';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ChangeEvent, FormEvent, use, useState } from 'react';
import { signInValidateAction, signUpAction } from '@/lib/actions/AuthActions';
import Container from '@/components/containers/Container';

export default function Singup() {
  const title = 'text-[16px] font-[500]';
  const inputSet =
    'w-full text-[14px] font-[600] block text-primarycolor placeholder:text-buttongray ';
  const errMasseage = 'text-red text-[10px] font-[500]';
  // const title = 'text-[16px] font-[500]';
  // const inputSet =
  //   'w-full text-[14px] font-[600] block text-primarycolor placeholder:text-buttongray ';
  // const errMasseage = 'text-red text-[10px] font-[500]';

  const phoneHyphen = (h: string) => {
    const digits = h.replace(/\D/g, '');

    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;

    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordCheck: '',
    phone: '',
    marriageDate: '',
  });

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [checkError, setCheckError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [marriageDateError, setMarriageDateError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const router = useRouter();

  const handleModalClose = () => {
    setSuccessModal(false);
    router.push('/invite-code');
  };

  const handleErrorReset = () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setCheckError('');
    setPhoneError('');
    setMarriageDateError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.passwordCheck) {
      setCheckError('*비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }
    try {
      const result = use(signUpAction(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.marriageDate
      ));

      if (!result.isSuccess) {
        handleErrorReset();
        if (result.type === 'email') {
          setEmailError(result.error || '회원가입 중 오류가 발생했습니다.');
        } else if (result.type === 'password') {
          setPasswordError(result.error || '회원가입 중 오류가 발생했습니다.');
        } else if (result.type === 'name') {
          setNameError(result.error || '회원가입 중 오류가 발생했습니다.');
        } else if (result.type === 'phone') {
          setPhoneError(result.error || '회원가입 중 오류가 발생했습니다.');
        } else if (result.type === 'marriageDate') {
          setMarriageDateError(
            result.error || '회원가입 중 오류가 발생했습니다.'
          );
        }
        return;
      } else {
        const signInResult = use(signInValidateAction(
          formData.email,
          formData.password
        ));
        if (signInResult.isSuccess && signInResult.data) {
          // 로그인 성공 시 NextAuth로 로그인 처리
          use(signIn('credentials', {
            redirect: false,
            id: result.data?.id || '',
            email: signInResult.data.email,
            password: formData.password,
            name: signInResult.data?.name || '',
            partnerCode: signInResult.data?.mate_code || 0,
          }));
          setSuccessModal(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valCheck =
      name === 'phone'
        ? phoneHyphen(value)
        : name === 'marriageDate'
          ? dateHyphen(value)
          : value;
    setFormData((prev) => ({
      ...prev,
      [name]: valCheck,
    }));
  };

  return (
    // <div className='flex flex-col pb-[40px] pt-[80px] px-[20px]'>
    <Container header={<Header title='회원가입' leftIcon='back'/>}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-[15px]'>
        <div className='flex flex-col gap-[10px]'>
          <Txt className={title}>이름</Txt>
          <InputComponent
            className={inputSet}
            type='text'
            name='name'
            placeholder='이름을 입력해 주세요'
            value={formData.name}
            onChange={handleInput}
            required
            maxLength={25}
          />
          <Txt className={errMasseage}>{nameError}</Txt>
        </div>

        <div className='flex flex-col gap-[10px]'>
          <Txt className={title}>이메일</Txt>
          <InputComponent
            className={inputSet}
            type='email'
            name='email'
            placeholder='abc@durihana.com'
            value={formData.email}
            onChange={handleInput}
            required
          />
          <Txt className={errMasseage}>{emailError}</Txt>
        </div>

        <div className='flex flex-col gap-[10px]'>
          <Txt className={title}>비밀번호</Txt>
          <InputComponent
            className={inputSet}
            type='password'
            name='password'
            placeholder='8자 이상을 입력해 주세요'
            value={formData.password}
            onChange={handleInput}
            required
          />
          <Txt className={errMasseage}>{passwordError}</Txt>
        </div>

        <div className='flex flex-col gap-[10px]'>
          <Txt className={title}>비밀번호 확인</Txt>
          <InputComponent
            className={inputSet}
            type='password'
            name='passwordCheck'
            placeholder='8자 이상을 입력해 주세요'
            value={formData.passwordCheck}
            onChange={handleInput}
            required
          />
          <Txt className={errMasseage}>{checkError}</Txt>
        </div>

        <div className='flex flex-col gap-[10px]'>
          <Txt className={title}>전화번호</Txt>
          <InputComponent
            className={inputSet}
            type='text'
            name='phone'
            placeholder='010-1234-1234'
            value={formData.phone}
            onChange={handleInput}
            required
          />
          <Txt className={errMasseage}>{phoneError}</Txt>
        </div>

        <div className='flex flex-col gap-[10px]'>
          <Txt className={title}>결혼 예정일</Txt>
          <InputComponent
            className={inputSet}
            type='text'
            name='marriageDate'
            placeholder='2027-01-01'
            value={formData.marriageDate}
            onChange={handleInput}
            required
          />
          <Txt className={errMasseage}>{marriageDateError}</Txt>
        </div>

        <div>
          <Button
            type='submit'
            className='block w-full mt-[40px]'
            disabled={isLoading}
          >
            {isLoading ? '가입중' : '완료'}
          </Button>
        </div>
      </form>

      {successModal && (
        <AlertModal onClose={handleModalClose}>
          <Txt size='text-[16px]' className='text-mainblack text-center'>
            회원가입이 완료되었습니다.
          </Txt>
          <Button className='mt-[20px] w-full' onClick={handleModalClose}>
            초대코드 받으러가기
          </Button>
        </AlertModal>
      )}
    </Container>
  );
}
