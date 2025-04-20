"use client";

import { DrawerFoldTable } from "@/components/drawer/fold-drawer";
import { useEffect, useState } from "react";

export const DrawerFoldProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerFoldTable />
        </>
    )
}