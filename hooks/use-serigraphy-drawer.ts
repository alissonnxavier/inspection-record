import { create } from 'zustand';

type DrawerSerigraphy = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useDrawerSerigraphy = create<DrawerSerigraphy>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))