import { create } from 'zustand';

type DrawerFinishigProps = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useDrawerFinishing = create<DrawerFinishigProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))