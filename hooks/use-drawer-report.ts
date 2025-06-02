import { create } from 'zustand';

interface ReportInterface {
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
    data: any;
    drawer: string;
    id: any;
};

export const useReporDrawer = create<ReportInterface>((set) => ({
    id: '',
    isOpen: false,
    data: {},
    drawer: '',
    onOpen: (id) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, data: null, drawer: '', id: '' }),
}));