'use client';

import {
    FontBoldIcon,
    FontItalicIcon,
    UnderlineIcon,
} from "@radix-ui/react-icons"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useEffect, useState } from "react";

interface ToggleResultProps {
    ResultValue: (str: any) => void;
}

export const ToggleResult: React.FC<ToggleResultProps> = ({ ResultValue }) => {

    const [result, setResult] = useState('');

    useEffect(() => {
        ResultValue(result)
    }, [ResultValue, result])

    return (
        <ToggleGroup
            type="single"
            onValueChange={(value) => { setResult(value) }}
        >
            <ToggleGroupItem
                value="Aprovado"
                aria-label="Toggle"
                className=""
            >
                Aprovado
            </ToggleGroupItem>
            <ToggleGroupItem
                value="Reprovado"
                aria-label="Toggle"
                className=""
            >
                Reprovado
            </ToggleGroupItem>
        </ToggleGroup>
    );
};
