import { DrawerPatter } from "../drawer-patter";
import { useDrawerPlate } from "@/hooks/use-plate-drawer";
import PlateTable from "../dataTable/tables/plate-table";

export function DrawerPlateTable() {

    const handleDrawer = useDrawerPlate();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <div className="w-full overflow-auto max-h-[80vh]">
                <PlateTable />
            </div>
        </DrawerPatter>
    )
}