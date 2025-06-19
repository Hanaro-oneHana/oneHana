'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';
import { Txt } from '../atoms';
import { StoreDetailProps } from './StoreDetail';

export default function StoreOption(
  details: StoreDetailProps & {
    onSelectChange?: (selected: Record<string, string>) => void;
  }
) {
  const content = details?.content;
  const type = details?.partner?.partnercategory?.type;

  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const updateSelected = (valueKey: string, item: string) => {
    const newSelected = { ...selected, [valueKey]: item };
    setSelected(newSelected);
    details?.onSelectChange?.(newSelected); // 부모에 전달해주기
  };

  const renderOptionItem = (
    label: string,
    values: string[] | undefined,
    valueKey: string
  ) => {
    if (!values) return null;

    return (
      <AccordionItem
        key={valueKey}
        value={valueKey}
        className='mx-[10px] border-[0.5px] last:border-b-[0.5px] rounded-[10px]'
      >
        <AccordionTrigger className='px-[10px] w-full'>
          <div className='flex justify-between items-center w-full'>
            <Txt size='text-[15px]'>{label}</Txt>
            {selected[valueKey] && (
              <span className='text-[13px] text-textgray'>
                {selected[valueKey]}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <Txt size='text-[12px]'>
          <AccordionContent className=' pb-0'>
            {values.map((item, idx) => (
              <p
                key={idx}
                className='px-[15px] py-[12px] border-t-[0.5px]'
                onClick={() => {
                  updateSelected(valueKey, item);
                  setOpenItems((prev) => prev.filter((v) => v !== valueKey));
                }}
              >
                {item}
              </p>
            ))}
          </AccordionContent>{' '}
        </Txt>
      </AccordionItem>
    );
  };

  //옵션들은 그 타입에 맞는 것들을(예식장, 스드메...) 하드코딩
  const optionConfig: Record<string, { label: string; key: string }[]> = {
    예식장: [
      { label: '식대', key: '식대' },
      { label: '식사형태', key: '식사형태' },
    ],
    스드메: [
      { label: '스튜디오', key: '스튜디오' },
      { label: '드레스형식', key: '드레스형식' },
      { label: '메이크업', key: '메이크업' },
    ],
  };

  if (!type || !optionConfig[type]) return null;

  const c = content as Record<string, string[]>;
  const options = optionConfig[type];

  return (
    <div>
      <Txt size='text-[15px]' weight='font-[500]' className='flex px-[20px]'>
        옵션
      </Txt>
      <div className='flex flex-col gap-[10px] px-[20px] py-[15px] pb-[100px]'>
        <Accordion
          type='multiple'
          value={openItems}
          onValueChange={setOpenItems}
          className='w-full flex flex-col gap-[15px]'
        >
          {options.map(({ label, key }) =>
            renderOptionItem(label, c[key], key)
          )}
        </Accordion>
      </div>
    </div>
  );
}
