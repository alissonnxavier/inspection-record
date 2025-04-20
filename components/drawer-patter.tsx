import {
    Drawer,
    DrawerContent,
} from "@/components/ui/drawer";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const DrawerPatter: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    children,
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <Drawer
            open={isOpen}
            onOpenChange={onChange}
        >
            <DrawerContent className="h-full border-1 border-black dark:border-slate-300">
                <div className="h-full mx-auto w-full ">
                    <div className="flex m-auto h-full">
                        {children}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
};


