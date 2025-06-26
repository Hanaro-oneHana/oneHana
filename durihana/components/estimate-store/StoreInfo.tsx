import { Txt } from '@/components/atoms';

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className='flex flex-row items-center justify-between'>
    <Txt size='text-[15px]' weight='font-[500]'>
      {label}
    </Txt>
    <Txt size='text-[14px]' weight='font-[500]'>
      {value}
    </Txt>
  </div>
);

export default function StoreInfo({ info }: { info: Record<string, string> }) {
  return (
    <div className='flex w-full flex-col gap-[20px] px-[20px] py-[10px]'>
      {info &&
        Object.keys(info).length > 0 &&
        Object.entries(info).map(([key, value]) => (
          <InfoRow key={key} label={key} value={value} />
        ))}
    </div>
  );
}
