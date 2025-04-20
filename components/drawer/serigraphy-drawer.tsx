import { DrawerPatter } from "../drawer-patter";
import { useDrawerSerigraphy } from "@/hooks/use-serigraphy-drawer";
import Table from '@/components/dataTable/tables/serigraphy-table';

export function DrawerSerigraphyTable() {
    const handleDrawer = useDrawerSerigraphy();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <Table />
        </DrawerPatter>
    )
}