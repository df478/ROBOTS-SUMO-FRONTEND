'use client';

import { setCookie } from 'cookies-next';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import axios from 'axios';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        { email, password }
      );

      const token = response.data;

      if (token) {
        localStorage.setItem('token', token);
        setCookie('token', token, {
          path: '/',
          sameSite: 'lax',
          secure: false,
        });
        router.push('/dashboard');
      } else {
        setError('Token no recibido');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Credenciales incorrectas');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h4" gutterBottom>Iniciar Sesión</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Ingresar
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
