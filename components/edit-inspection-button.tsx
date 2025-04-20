import { useEditForm } from '@/hooks/use-edit-form';
import React from 'react';
import { Button } from './ui/button';
import { useDrawerPlate } from '@/hooks/use-plate-drawer';
import { usePressDrawer } from '@/hooks/use-press-drawer';
import { usePunchingDrawer } from '@/hooks/use-punching-drawer';
import { useThreader } from '@/hooks/use-press-threader';
import { useFold } from '@/hooks/use-press-fold';
import { useDrawerSoldier } from '@/hooks/use-drawer-soldier';
import { useDrawerFinishing } from '@/hooks/use-press-finishing';
import { useDrawerSerigraphy } from '@/hooks/use-serigraphy-drawer';

interface EditProps {
    id: string;
    tab: string;
}

const ButtonEditInspection: React.FC<EditProps> = ({
    id, tab
}) => {

    const handleEditForm = useEditForm();
    const handleDrawerPlate = useDrawerPlate();
    const handleDrawerPress = usePressDrawer();
    const handleDrawerPunchingMachine = usePunchingDrawer();
    const handleDrawerThreader = useThreader();
    const handleDrawerFold = useFold();
    const handleDrawerSoldier = useDrawerSoldier();
    const handleDrawerFinishing = useDrawerFinishing();
    const handleDrawerSerigraphy = useDrawerSerigraphy();

    return (
        <Button
            variant='link'
            onClick={
                () => {
                    handleEditForm.setData(tab, id);
                    handleDrawerPlate.onClose();
                    handleDrawerPress.onClose();
                    handleDrawerPunchingMachine.onClose();
                    handleDrawerThreader.onClose()
                    handleDrawerFold.onClose();
                    handleDrawerSoldier.onClose();
                    handleDrawerFinishing.onClose();
                    handleDrawerSerigraphy.onClose();
                }
            }
            className='text-black dark:text-white'
        >
            Editar
        </Button>
    )
}

export default ButtonEditInspection;