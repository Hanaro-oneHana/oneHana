'use client';

import { useReducer, useState, Fragment } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Dropdown() {
    const defaultTitle = '옵션 선택';
    const [content, setContent] = useState<string>(defaultTitle);
    const [isOpen, toggleOpen] = useReducer((prev) => !prev, false);

    const folders = ['a', 'b', 'c'];

    return <>
        <DropdownMenu onOpenChange={toggleOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                    {content} {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
                {folders.map((title, i) => (
                <Fragment key={title}>
                    <DropdownMenuCheckboxItem
                    checked={content === title}
                    onClick={(e) => {
                        // 클릭된 메뉴의 innerText(= 아이템 텍스트)를 읽어서 상태에 저장
                        const txt = e.currentTarget.textContent?.trim() ?? defaultTitle;
                        setContent(txt);
                    }}
                    >
                    {title}
                    </DropdownMenuCheckboxItem>

                    {i < folders.length - 1 && <DropdownMenuSeparator />}
                </Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    </>;
}
