'use client';

import React, { useEffect, useState } from 'react'
import { FormsInspectionRecords } from './forms-inspections-record';
import { useSession } from "next-auth/react";
import { verifyAdmin } from "@/actions/verify-admin";



const HomePage = () => {

    const { data: session } = useSession();
    const [admin, setAdmin] = useState(false);

    const AdminOrNot = async () => {
        const res = await verifyAdmin(session?.user?.email);
        if (res === 'true') {
            setAdmin(true);
        }
    }
    useEffect(() => {
        AdminOrNot();
    }, [session]);

    if (!admin) {
        return (
            <div className=''>

            </div>
        )
    }

    return (
        <FormsInspectionRecords />
    )
};

export default HomePage;

