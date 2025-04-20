
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title: string;
    description: string;
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    description,
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onChange}
        >
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="w-5/6 sm:max-w-[425px]" >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
