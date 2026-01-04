import { DrawerPatter } from "../drawer-patter";
import Table from '@/components/dataTable/tables/nc-table';
import { useDrawerNc } from "@/hooks/use-nc-drawer";

export function DrawerNcTable() {
    const handleDrawer = useDrawerNc();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <Table />
        </DrawerPatter>
    )
}