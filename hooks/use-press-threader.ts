import { create } from 'zustand';

type DrawerThreader = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useThreader = create<DrawerThreader>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))