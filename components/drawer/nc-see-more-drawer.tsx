import { DrawerPatter } from "../drawer-patter";
import { useDrawerNcSeeMore } from "@/hooks/use-nc-see-more-drawer";
import { NcSeeMorePage } from "../nc-see-more-page";

export function DrawerNcSeeMore() {

    const handleDrawer = useDrawerNcSeeMore();

    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <NcSeeMorePage />
        </DrawerPatter>
    )
}