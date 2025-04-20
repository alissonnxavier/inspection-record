"use client";

import { DrawerFinishingTable } from "@/components/drawer/finishing-drawer";
import { useEffect, useState } from "react";

export const DrawerFinishingProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerFinishingTable />
        </>
    )
}