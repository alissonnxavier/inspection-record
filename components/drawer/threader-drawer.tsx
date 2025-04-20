import { DrawerPatter } from "../drawer-patter";
import Table from "@/components/dataTable/tables/threader-table";
import { useThreader } from "@/hooks/use-press-threader";

export function DrawerThreaderTable() {

    const handleDrawer = useThreader();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <Table />
        </DrawerPatter>
    )
}