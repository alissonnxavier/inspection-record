"use client";

import { DrawerPlateTable } from "@/components/drawer/plate-drawer";
import { useEffect, useState } from "react";

export const DrawerPlateProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerPlateTable />
        </>
    )
}