import { Button, Header, Txt } from '@/components/atoms';
import Container from '@/components/containers/Container';
import { use } from 'react';
import { getCategoryData } from '@/lib/actions/AssetActions';
import { getAllInterestRates } from '@/lib/actions/InterestActions';
import { getUserInfo } from '@/lib/actions/UserActions';
import { auth } from '@/lib/auth';

export default function Mypage() {
  const session = use(auth());
  const userId = Number(session?.user?.id);

  const userInfo = use(getUserInfo(userId));

  const interestInfo = use(getAllInterestRates());
  const steps = ['기본', 'step 1', 'step 2', 'step 3', 'step 4', 'step 5'];

  const completedCategory = use(
    getCategoryData(
      session?.user?.isMain
        ? Number(session.user.id)
        : Number(session?.user?.partnerId)
    )
  );
  const completedCnt = completedCategory.data?.length;

  return (
    <Container
      className='pt-[70px] pb-[40px]'
      header={<Header title='마이페이지' leftIcon='back' />}
    >
      <div className='flex w-full flex-col gap-[30px] px-[5px]'>
        {/*유저 회원 정보*/}
        {userInfo &&
          Object.entries(userInfo).map(([label, value]) => (
            <div
              key={label}
              className='border-linegray flex flex-col gap-[10px] border-b pb-[6px]'
            >
              <Txt weight='font-[500]'>{label}</Txt>
              <Txt
                color='text-primarycolor'
                size='text-[14px]'
                weight='font-[600]'
                className='block w-full'
              >
                {value}
              </Txt>
            </div>
          ))}

        {/*이자율 정보*/}
        <div>
          <Txt weight='font-[500]' className='flex pb-[15px]'>
            우리 부부의 이자율
          </Txt>

          {/* 헤더 행 */}
          <div className='border-linegray grid h-[50px] grid-cols-4 border'>
            <div className='border-linegray flex items-center justify-center border-r'>
              <Txt>구분</Txt>
            </div>
            {interestInfo.map(({ label }) => (
              <div
                key={label}
                className='border-linegray flex items-center justify-center border-r last:border-r-0'
              >
                <Txt>{label}</Txt>
              </div>
            ))}
          </div>

          {/* 본문 */}
          {steps.map((step, index) => (
            <div
              key={index}
              className='border-linegray grid h-[50px] grid-cols-4 border-x border-b'
            >
              <div className='border-linegray flex items-center justify-center border-r'>
                {index === completedCnt ? (
                  <Txt
                    size='text-[14px]'
                    color='text-primarycolor'
                    weight='font-[600]'
                  >
                    {step}
                  </Txt>
                ) : (
                  <Txt size='text-[14px]'>{step}</Txt>
                )}
              </div>
              {interestInfo.map(({ rates, label }) => (
                <div
                  key={`${label}-${index}`}
                  className='border-linegray flex items-center justify-center border-r last:border-r-0'
                >
                  {index === completedCnt ? (
                    <Txt
                      size='text-[14px]'
                      color='text-primarycolor'
                      weight='font-[600]'
                    >
                      {rates[index]}
                    </Txt>
                  ) : (
                    <Txt size='text-[14px]'>{rates[index]}</Txt>
                  )}
                </div>
              ))}
            </div>
          ))}
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
    </Container>
  );
}
