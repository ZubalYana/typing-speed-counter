import { Snackbar, Alert } from '@mui/material';
import useAlertStore from '../stores/useAlertStore';

export default function AlertSnackbar() {
    const { open, message, severity, closeAlert } = useAlertStore();

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={closeAlert}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={closeAlert} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
