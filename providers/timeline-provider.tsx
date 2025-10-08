"use client";

import { DrawerTimeLine } from "@/components/drawer/timeline-drawer";
import { useEffect, useState } from "react";

export const Timeline = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <>
            <div>
                <DrawerTimeLine />
            </div>
        </>
    )
}