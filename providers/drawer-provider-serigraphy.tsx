"use client";

import { DrawerSerigraphyTable } from "@/components/drawer/serigraphy-drawer";
import { useEffect, useState } from "react";

export const DrawerSerigraphyProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerSerigraphyTable />
        </>
    )
}