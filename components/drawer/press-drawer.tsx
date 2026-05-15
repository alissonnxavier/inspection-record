import { usePressDrawer } from "@/hooks/use-press-drawer";
import { DrawerPatter } from "../drawer-patter";
import Table from "@/components/dataTable/tables/press-table";

export function DrawerPressTable() {

    const handleDrawer = usePressDrawer();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <div className="w-full overflow-auto max-h-[80vh]">
                <Table />
            </div>
        </DrawerPatter>
    )
}