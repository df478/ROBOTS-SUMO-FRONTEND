'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type Snack = { message: string; type: AlertColor };

const SnackbarContext = createContext<{
  showSnack: (msg: string, type?: AlertColor) => void;
}>({ showSnack: () => {} });

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snack, setSnack] = useState<Snack | null>(null);
  const handleClose = () => setSnack(null);

  return (
    <SnackbarContext.Provider value={{
      showSnack: (message, type = 'info') => setSnack({ message, type })
    }}>
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
      >
        {snack ? (
          <Alert severity={snack.type} onClose={handleClose} variant="filled">
            {snack.message}
          </Alert>
        ) : undefined}
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
}

export const useSnack = () => useContext(SnackbarContext);
