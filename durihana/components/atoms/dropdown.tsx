'use client';

import React, { useReducer, useState, useRef, useEffect, Fragment } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import Button from './Button';

export type DropdownProps = {
    items: [string, string][]; // [[name, price], ...]
    defaultTitle?: string;
};

export default function Dropdown({
    items,
    defaultTitle = '선택지',
}: DropdownProps) {
    const [isOpen, toggleOpen] = useReducer((prev) => !prev, false);
    const [selected, setSelected] = useState<[string, string] | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if ( dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && isOpen)
                toggleOpen();
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const content = selected ? `${selected[0]}  ${selected[1]}` : defaultTitle;

    return <>
        <div className="relative inline-block" ref={dropdownRef}>
            <Button
            onClick={toggleOpen}
            className={ `w-[325px] h-[40px] px-4 flex items-center justify-between
            ${isOpen ? 'rounded-b-none' : ''}`}>
                <span className="truncate">{content}</span>
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Button>

            {isOpen && ( <div
                className="absolute right-0 mt-0 w-[325px] bg-white border border-gray-200 border-t-0 rounded-b-[10px] rounded-t-none shadow-lg max-h-[200px] overflow-auto z-10"
                >
                <ul className="p-0 m-0 list-none">
                    {items.map(([name, price], i) => (
                    <Fragment key={name}>
                        <li className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            setSelected([name, price]);
                            toggleOpen();
                        }}>
                            <span>{name}</span>
                            <span>{price}</span>
                        </li>
                        {i < items.length - 1 && <hr className="border-gray-200 m-0" />}
                    </Fragment>))}
                </ul>
            </div>)}
        </div>
    </>;
}
