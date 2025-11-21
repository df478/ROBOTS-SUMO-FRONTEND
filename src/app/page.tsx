import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4, textAlign: "center" }}>
        <Typography variant="h2" component="h1" gutterBottom>
          COMPETENCIA DE ROBOTS SUMO
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Bienvenido a la competencia de robots sumo, donde la ingeniería y la
          estrategia se unen para crear el robot más fuerte y astuto.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            href="/auth/login"
            variant="contained"
            size="large"
            sx={{ minWidth: 200 }}
          >
            Dashboard
          </Button>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            href="/public/resultados"
            variant="contained"
            size="large"
            sx={{ minWidth: 200 }}
          >
            Ver Resultados
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
