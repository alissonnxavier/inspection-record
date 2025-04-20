import { useDrawerSoldier } from "@/hooks/use-drawer-soldier";
import { DrawerPatter } from "../drawer-patter";
import Table from "@/components/dataTable/tables/soldier-table";

export function DrawerSoldierTable() {

    const handleDrawer = useDrawerSoldier();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <Table />
        </DrawerPatter>
    )
}