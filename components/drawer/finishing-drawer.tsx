import { useDrawerFinishing } from "@/hooks/use-press-finishing";
import { DrawerPatter } from "../drawer-patter";
import Table from "@/components/dataTable/tables/finishing-table";

export function DrawerFinishingTable() {

    const handleDrawer = useDrawerFinishing();
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