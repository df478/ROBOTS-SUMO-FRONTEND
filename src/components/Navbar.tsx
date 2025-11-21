'use client';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onMenuClick: () => void;
  drawerWidth: number;
}

export default function Navbar({ onMenuClick, drawerWidth }: NavbarProps) {
  const router = useRouter();
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Competencia Robots
        </Typography>
        <Button color="inherit" onClick={() => {
          localStorage.removeItem('token');
          router.push('/auth/login');
        }}>
          Salir
        </Button>
      </Toolbar>
    </AppBar>
  );
}
