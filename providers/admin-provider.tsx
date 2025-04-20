"use client";

import AdminForProvider from "@/components/admin-for-provider";
import { useEffect, useState } from "react";

export const AdminProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AdminForProvider />
        </>
    )
}