'use client';

import { useReducer, useState, Fragment } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Dropdown() {
    const defaultTitle = '선택지 이름';
    // 데이터
    const folders2: [string, string][] = [
        ['a', '100'], ['b', '1000'], ['c', '100'] ];

    const [selected, setSelected] = useState<[string, string] | null>(null);
    const [isOpen, toggleOpen] = useReducer(prev => !prev, false);
    const content = selected ? `${selected[0]}  ${selected[1]}` : defaultTitle;

    return <>
        <DropdownMenu onOpenChange={toggleOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`w-[325px] h-[40px] flex items-center justify-between px-4
                ${isOpen ? 'rounded-b-none' : ''}`}>
                    <span className="truncate">{content}</span>
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={0} className="mt-0 border-t-0 rounded-t-none w-[325px] max-h-[200px] overflow-auto">
                {folders2.map(([name, price], i) => (
                    <Fragment key={name}>
                        <DropdownMenuCheckboxItem className="px-4"
                        checked={selected?.[0] === name}
                        onClick={() => setSelected([name, price])}>
                            <div className="w-full flex justify-between items-center pl-8">
                                <span>{name}</span>
                                <span>{price}</span>
                            </div>
                        </DropdownMenuCheckboxItem>
                    {i < folders2.length - 1 && <DropdownMenuSeparator />}
                </Fragment>))}
            </DropdownMenuContent>
        </DropdownMenu>
    </>;
}