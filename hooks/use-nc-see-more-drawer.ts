import { create } from 'zustand';

type DrawerNc = {
    id: any;
    isOpen: boolean;
    onOpen: (id: any) => void;
    onClose: () => void;
};

export const useDrawerNcSeeMore = create<DrawerNc>((set) => ({
    id: null,
    isOpen: false,
    onOpen: (id: any) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: null }),
}))