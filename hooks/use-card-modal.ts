import { create } from 'zustand';

type CardModalRegister = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useCardModal = create<CardModalRegister>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))