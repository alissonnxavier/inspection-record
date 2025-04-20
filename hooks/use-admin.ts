import { create } from 'zustand';

interface AdminProps {
    isAdmin: boolean;
    onOpen: (admin: boolean) => void;
    onClose: () => void;
    admin: boolean;
};

export const useAdminHook = create<AdminProps>((set) => ({
    isAdmin: false,
    admin: false,
    onOpen: (admin) => set({ admin }),
    onClose: () => set({ admin: false }),
}))