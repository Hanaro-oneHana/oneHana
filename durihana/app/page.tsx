import Txt from '@/components/atoms/Txt';

export default function Home() {
  return (
    <>
      <Txt
        size={16}
        color='textgray'
        weight='regular'
        height={20}
        align='center'
      >
        Welcome to the application!
      </Txt>
      <Txt size={20} color='mainBlack' weight='bold' height={24}>
        Hello World
      </Txt>
    </>
  );
}
