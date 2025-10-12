"use client";

import { DrawerChats } from "@/components/drawer/charts-drawer";
import { useEffect, useState } from "react";

export const ChartProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <>
            <div>
                <DrawerChats />
            </div>
        </>
    )
}