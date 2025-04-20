"use client";

import { DrawerRepor } from "@/components/drawer/report-drawer";
import { useEffect, useState } from "react";

export const ReportProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerRepor />
        </>
    )
}