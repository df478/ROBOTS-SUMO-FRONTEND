'use client';
import { ReactNode, useState } from 'react';
import { Box, Toolbar, Drawer } from '@mui/material';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Navbar onMenuClick={toggleDrawer} drawerWidth={drawerWidth} />
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: drawerWidth },
          display: { xs: 'block', sm: 'none' },
        }}
      >
        <Sidebar />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': { width: drawerWidth },
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        <Sidebar />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto', ml: { sm: `${drawerWidth}px` },}}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
