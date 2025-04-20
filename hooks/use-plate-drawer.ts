import { create } from 'zustand';

type DrawerPlate = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useDrawerPlate = create<DrawerPlate>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));