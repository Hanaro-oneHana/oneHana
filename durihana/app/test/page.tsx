'use client'
import Dropdown from "@/components/atoms/dropdown";

export default function Test() {
    const test = ['a', 'b', 'c'];
    const handleSelect = (value: string) => {
      console.log('선택된 값:', value);
    };


    return <>
        <Dropdown items={test} 
        onSelect={handleSelect}/>
    
    </>;
}