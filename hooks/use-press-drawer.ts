import { create } from 'zustand';

type DrawerPress = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const usePressDrawer = create<DrawerPress>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))