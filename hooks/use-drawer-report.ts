import { create } from 'zustand';

interface ReportInterface {
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
    data: any;
    drawer: string;
    id: any;
    itemId?: any;
    open?: boolean;
    status?: any [] ;
};

export const useReporDrawer = create<ReportInterface>((set) => ({
    id: '',
    itemId: '',
    isOpen: false,
    status: [],
    open: true,
    data: {},
    drawer: '',
    onOpen: (id: any) => set({ isOpen: true, id, itemId: '' }),
    onClose: () => set({ isOpen: false, data: null, drawer: '', id: '', itemId: '', open: true, status: []}),
}));