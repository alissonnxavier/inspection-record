import { create } from 'zustand';

type DrawerFoldProps = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useFold = create<DrawerFoldProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))