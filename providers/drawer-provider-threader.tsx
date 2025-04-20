"use client";

import { DrawerThreaderTable } from "@/components/drawer/threader-drawer";
import { useEffect, useState } from "react";

export const DrawerThreaderProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerThreaderTable />
        </>
    )
}