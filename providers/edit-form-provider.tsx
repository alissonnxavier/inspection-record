"use client";

import EditFormForProvider from "@/components/form-edit-fro-provider";
import { useEffect, useState } from "react";

export const EditFormProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <EditFormForProvider />
        </>
    )
}