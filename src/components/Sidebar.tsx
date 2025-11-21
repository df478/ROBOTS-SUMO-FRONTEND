// components/Sidebar.tsx
'use client';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const items = [
    { text: 'Inicio', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Configuracion', icon: <DashboardIcon />, path: '/dashboard/configuracion' },
    { text: 'Tutores', icon: <PeopleIcon />, path: '/dashboard/tutores' },
    { text: 'Participantes', icon: <PeopleIcon />, path: '/dashboard/participantes' },
    { text: 'Equipos', icon: <PeopleIcon />, path: '/dashboard/equipos' },
    { text: 'Rondas', icon: <SportsKabaddiIcon />, path: '/dashboard/rondas' },
    { text: 'Puntajes', icon: <ScoreboardIcon />, path: '/dashboard/puntajes' },
  ];
  return (
    <div>
      <List>
        {items.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => router.push(path)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );
}
