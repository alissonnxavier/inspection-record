import React from 'react'
import Admin from './admin'
import { useEditForm } from '@/hooks/use-edit-form';

const EditFormForProvider = () => {

    const handleEditFor = useEditForm();
    return (
        <Admin admin={handleEditFor.tab} />
    )
}

export default EditFormForProvider;