import { create } from 'zustand';

interface AppState {
    isLoading: boolean;
    sidebarOpen: boolean;

    setLoading: (loading: boolean) => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isLoading: false,
    sidebarOpen: false,

    setLoading: (isLoading) => set({ isLoading }),

    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));