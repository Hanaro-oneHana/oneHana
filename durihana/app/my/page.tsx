import { Button, Header, Txt } from '@/components/atoms';
import { getInterestsByUserId, getUserInfo } from '@/lib/actions/UserActions';
import { auth } from '@/lib/auth';

export default async function Mypage() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  const userInfo = await getUserInfo(userId);

  const interestInfo = await getInterestsByUserId(userId);

  return (
    <>
      <Header title='마이페이지' leftIcon='back' />
      <div className='flex flex-col mb-[100px] mt-[100px] px-[25px]'>
        <div className='flex flex-col gap-[30px]'>
          {/*유저 회원 정보*/}
          {userInfo &&
            Object.entries(userInfo).map(([label, value]) => (
              <div
                key={label}
                className='flex flex-col gap-[10px] border-b border-linegray pb-[6px]'
              >
                <Txt weight='font-[500]'>{label}</Txt>
                <Txt
                  color='text-primarycolor'
                  size='text-[14px]'
                  weight='font-[600]'
                  className='w-full block'
                >
                  {value}
                </Txt>
              </div>
            ))}

          {/*이자율 정보*/}
          <div>
            <Txt weight='font-[500]' className='flex pb-[15px]'>
              현재 적용 중인 이자율
            </Txt>
            {/*첫번째 행*/}
            <div className='grid grid-cols-3 border border-linegray h-[50px]'>
              {Object.keys(interestInfo).map((label) => (
                <div
                  key={label}
                  className='flex items-center justify-center border-r last:border-r-0'
                >
                  <Txt>{label}</Txt>
                </div>
              ))}
            </div>
            {/*두번째 행*/}
            <div className='grid grid-cols-3 border-x border-b border-linegray h-[50px]'>
              {Object.values(interestInfo).map((value, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-center border-r last:border-r-0'
                >
                  <Txt
                    color='text-primarycolor'
                    size='text-[14px]'
                    weight='font-[600]'
                  >
                    {value}
                  </Txt>
                </div>
              ))}
            </div>
          </div>

          {/*버튼*/}
          <div className='flex gap-[15px]'>
            <Button bgColor='bg-icon' disabled>
              탈퇴하기
            </Button>
            <Button bgColor='bg-primarycolor' disabled>
              내 정보 수정
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
