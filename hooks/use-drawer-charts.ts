import { create } from 'zustand';

type DrawerCharts = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useChartsDrawer = create<DrawerCharts>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));