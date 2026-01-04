"use client";

import { DrawerNcTable } from "@/components/drawer/nc-drawer";
import { useEffect, useState } from "react";

export const DrawerNcProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerNcTable />
        </>
    )
}