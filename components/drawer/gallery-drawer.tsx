import { DrawerPatter } from "../drawer-patter";
import { useGalleryDrawer } from "@/hooks/use-modal-gallery";
import Gallery from "../gallery";

export function DrawerGallery() {

    const handleDrawer = useGalleryDrawer();
    
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <Gallery data={handleDrawer.data} drawer={handleDrawer.drawer}/>
        </DrawerPatter>
    )
}