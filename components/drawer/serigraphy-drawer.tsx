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
            <div className="w-full overflow-auto max-h-[80vh]">
                <Table />
            </div>
        </DrawerPatter>
    )
}