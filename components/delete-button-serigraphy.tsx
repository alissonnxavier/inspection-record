import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import { verifyAdmin } from '@/actions/verify-admin';
import { deleteRegisterPlate, deleteRegisterSerigraphy } from '@/actions/delete-registers';
import { RiseLoader } from 'react-spinners';
import { useAdminHook } from '@/hooks/use-admin';

interface DeleteButtonProps {
    id: string;
    images: [];
}

const DeleteButtonSerigraphy: React.FC<DeleteButtonProps> = ({ id, images }) => {

    const { data: session } = useSession();
    const [admin, setAdmin] = useState(false);
    const handleAdmin = useAdminHook();

    const HandleDelete = (id: string, imagesName: []) => {
        if (handleAdmin.admin) {
            deleteRegisterSerigraphy(id, imagesName);
            location.reload();
        }
    }

    if (!handleAdmin.admin) {
        return null;
    }

    return (
        <Button
            onClick={() => {
                HandleDelete(id, images)
            }}
            variant='delete'>
            Deletar
        </Button>
    )
}

export default DeleteButtonSerigraphy;