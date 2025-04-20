import React from 'react'
import Admin from './admin'
import { useAdminHook } from '@/hooks/use-admin';

const AdminForProvider = () => {

    const handleAdmin = useAdminHook();
    return (
        <Admin admin={handleAdmin.admin} />
    )
}

export default AdminForProvider