"use client";

import { DrawerGallery } from "@/components/drawer/gallery-drawer";
import { useEffect, useState } from "react";

export const ProviderGallery = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DrawerGallery />
        </>
    )
}