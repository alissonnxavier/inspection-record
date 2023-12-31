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

interface ToggleItemsProps {
    prefixResult: (str: any) => void;
};

export const ToggleItems: React.FC<ToggleItemsProps> = ({ prefixResult }) => {

    const [prefix, setPrefix] = useState('');

    useEffect(()=>{
        prefixResult(prefix);
    },[prefixResult, prefix]);

    return (
        <ToggleGroup
            type="single"
            onValueChange={(value) => { setPrefix(value) }}
        >
            <ToggleGroupItem value="ME." aria-label="Toggle">
                ME.
            </ToggleGroupItem>
            <ToggleGroupItem value="PU." aria-label="Toggle">
                PU.
            </ToggleGroupItem>
            <ToggleGroupItem value="ENP." aria-label="Toggle">
                ENP.
            </ToggleGroupItem>
        </ToggleGroup>
    );
};
