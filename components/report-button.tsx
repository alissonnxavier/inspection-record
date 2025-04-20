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
import { useReporDrawer } from '@/hooks/use-drawer-report';

interface EditProps {
    id: string;

}

const ButtonReport: React.FC<EditProps> = ({
    id
}) => {

    const handleDrawerReport = useReporDrawer();
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
                    handleDrawerReport.onOpen();
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
            Relatório
        </Button>
    )
}

export default ButtonReport;