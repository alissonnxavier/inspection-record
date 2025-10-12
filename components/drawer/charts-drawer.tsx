import ChartsPage from "../charts/charts-page";
import { DrawerPatter } from "../drawer-patter";
import { useChartsDrawer } from "@/hooks/use-drawer-charts";

export function DrawerChats() {

    const handleDrawer = useChartsDrawer();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <div className="w-full">
                <ChartsPage />
            </div>
        </DrawerPatter>
    )
}