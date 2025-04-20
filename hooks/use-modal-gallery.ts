import { create } from 'zustand';

interface CardGalleryRegister {
    isOpen: boolean;
    onOpen: (data: any, drawer: string) => void;
    onClose: () => void;
    data: any;
    drawer: string;
};

export const useGalleryDrawer = create<CardGalleryRegister>((set) => ({
    isOpen: false,
    data: {},
    drawer: '',
    onOpen: (data = {}, drawer) => set({ isOpen: true, data, drawer }),
    onClose: () => set({ isOpen: false, data: null, drawer: '' }),
}))