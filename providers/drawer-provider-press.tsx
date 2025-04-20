"use client";

import { DrawerPressTable } from '@/components/drawer/press-drawer';
import { useEffect, useState } from "react";

export const DrawerPressProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerPressTable />
        </>
    )
}