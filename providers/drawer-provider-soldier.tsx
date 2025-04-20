"use client";

import { DrawerSoldierTable } from "@/components/drawer/soldier-drawer";
import { useEffect, useState } from "react";

export const DrawerSoldierProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerSoldierTable />
        </>
    )
}