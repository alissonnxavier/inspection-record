import { useFold } from "@/hooks/use-press-fold";
import { DrawerPatter } from "../drawer-patter";
import Table from "@/components/dataTable/tables/fold-table";

export function DrawerFoldTable() {

    const handleDrawer = useFold();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <Table />
        </DrawerPatter>
    )
}