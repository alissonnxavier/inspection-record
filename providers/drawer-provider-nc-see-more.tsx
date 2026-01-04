"use client";

import { useEffect, useState } from "react";
import { DrawerNcSeeMore } from "@/components/drawer/nc-see-more-drawer";

export const DrawerNcSeeMoreProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerNcSeeMore />
        </>
    )
}