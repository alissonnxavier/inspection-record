import { usePunchingDrawer } from "@/hooks/use-punching-drawer";
import { DrawerPatter } from "../drawer-patter";
import Table from "@/components/dataTable/tables/punching-table";

export function DrawerPunchingTable() {

    const handleDrawer = usePunchingDrawer();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <Table />
        </DrawerPatter>
    )
}