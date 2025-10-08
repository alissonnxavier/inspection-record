import { create } from 'zustand';

type DrawerTimeLine = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useTimeLineDrawer = create<DrawerTimeLine>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));