import { create } from 'zustand';

type DrawerPunching = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const usePunchingDrawer = create<DrawerPunching>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))