import { create } from 'zustand';

type DrawerNc = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useDrawerNc = create<DrawerNc>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))