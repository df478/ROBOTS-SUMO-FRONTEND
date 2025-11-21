"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, number, z } from "zod";
import { useSnack } from "@/components/SnackbarProvider";
import { ConfigAPI } from "@/lib/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const schema = object({
  numeroClasificados: number()
    .min(1, "Debe ser al menos 1")
    .max(100, "Máximo 100")
    .int("Debe ser entero"),
  numeroPistas: number()
    .min(1, "Debe ser al menos 1")
    .max(50, "Máximo 50")
    .int("Debe ser entero"),
});
type FormData = z.infer<typeof schema>;

export default function ConfigPage() {
  const { showSnack } = useSnack();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { numeroClasificados: 3, numeroPistas: 4 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await ConfigAPI.saveSettings(data);
      showSnack("Configuración guardada", "success");
    } catch (e: any) {
      showSnack(
        e.response?.data?.message || "Error al guardar configuración",
        "error"
      );
    }
  };

  const [competing, setCompeting] = useState<boolean>(false);
  const [loadingCompetencia, setLoadingCompetencia] = useState(false);
  const [topClasificados, setTopClasificados] = useState<any[]>([]);

  const toggleCompetition = async () => {
    setLoadingCompetencia(true);
    try {
      if (!competing) {
        await ConfigAPI.iniciarCompetencia();
        showSnack("Competencia iniciada", "success");
      } else {
        await ConfigAPI.detenerCompetencia();
        const res = await ConfigAPI.detenerCompetencia();
        setTopClasificados(res.data);
        showSnack("Competencia detenida", "info");
      }
      setCompeting(!competing);
    } catch (e: any) {
      showSnack(
        e.response?.data?.message || "Error al cambiar estado",
        "error"
      );
    } finally {
      setLoadingCompetencia(false);
    }
  };

  const clasificadosColumns: GridColDef[] = [
    { field: "nombreCompleto", headerName: "Nombre", flex: 1 },
    { field: "puntajeTotal", headerName: "Puntaje", width: 120 },
    { field: "equipo", headerName: "Equipo", flex: 1 },
  ];

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Configuración de competencia
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="numeroClasificados"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Número de clasificados"
              type="number"
              fullWidth
              error={!!errors.numeroClasificados}
              helperText={errors.numeroClasificados?.message}
              InputProps={{ inputProps: { min: 1, step: 1 } }}
              sx={{ mb: 2 }}
            />
          )}
        />
        <Controller
          name="numeroPistas"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Número de pistas"
              type="number"
              fullWidth
              error={!!errors.numeroPistas}
              helperText={errors.numeroPistas?.message}
              InputProps={{ inputProps: { min: 1, step: 1 } }}
              sx={{ mb: 4 }}
            />
          )}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            Guardar
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          color={competing ? "warning" : "primary"}
          onClick={toggleCompetition}
          disabled={loadingCompetencia}
          startIcon={loadingCompetencia ? <CircularProgress size={20} /> : null}
        >
          {competing ? "Detener competencia" : "Iniciar competencia"}
        </Button>
      </Box>
      {/* Mostrar clasificados si existen */}
      {topClasificados.length > 0 && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Top {topClasificados.length} Clasificados
          </Typography>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={topClasificados}
              columns={clasificadosColumns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: topClasificados.length, page: 0 },
                },
              }}
              hideFooter
            />
          </div>
        </Paper>
      )}
    </Container>
  );
}
