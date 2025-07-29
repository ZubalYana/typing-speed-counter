import { create } from 'zustand'

type AlertSeverity = 'success' | 'error' | 'info' | 'warning';

interface AlertState {
    open: boolean;
    message: string;
    severity: AlertSeverity;
    showAlert: (message: string, severity?: AlertSeverity) => void;
    closeAlert: () => void;
}

const useAlertStore = create<AlertState>((set) => ({
    open: false,
    message: '',
    severity: 'info',
    showAlert: (message, severity = 'info') =>
        set({ open: true, message, severity }),
    closeAlert: () => set({ open: false }),
}));

export default useAlertStore;