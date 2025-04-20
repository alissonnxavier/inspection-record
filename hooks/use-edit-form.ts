import { create } from 'zustand';

type PropsEditForm = {
    isOpen: boolean;
    tab: string;
    id: string;
    setData: (tab: string, data: any) => void;
    clearData: () => void;
};

export const useEditForm = create<PropsEditForm>((set) => ({
    tab: 'PlateSteel',
    id: '',
    isOpen: false,
    setData: (tab = '', id = '') => set({ tab, id }),
    clearData: () => set({ id: '', tab: 'PlateSteel' }),
}));