import { create } from 'zustand';

type DrawerSoldierProps = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useDrawerSoldier = create<DrawerSoldierProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))