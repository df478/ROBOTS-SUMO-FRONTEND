'use client';
import { ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { SnackbarProvider } from '@/components/SnackbarProvider';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head />
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
          {children}
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
