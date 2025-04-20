import { create } from 'zustand';

interface ReportInterface {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    data: any;
    drawer: string;
};

export const useReporDrawer = create<ReportInterface>((set) => ({
    isOpen: false,
    data: {},
    drawer: '',
    onOpen: () => set({ isOpen: true}),
    onClose: () => set({ isOpen: false, data: null, drawer: '' }),
}))