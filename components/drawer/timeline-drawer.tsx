import { DrawerPatter } from "../drawer-patter";
import PlateTable from "../dataTable/tables/plate-table";
import { useTimeLineDrawer } from "@/hooks/use-drawer-timeline";
import TimeLinePage from "../timeline-page";

export function DrawerTimeLine() {

    const handleDrawer = useTimeLineDrawer();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <div className="w-full">
                <TimeLinePage />
            </div>

        </DrawerPatter>
    )
}