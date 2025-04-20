"use client";

import { DrawerPunchingTable } from "@/components/drawer/punching-drawer";
import { useEffect, useState } from "react";

export const DrawerPunchingProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerPunchingTable />
        </>
    )
}