"use client";
import React from "react";
import {
  Box,
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { useSnack } from "@/components/SnackbarProvider";

const schema = object({
  nombreCompleto: string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "Máximo 100 caracteres"),
  carnetIdentidad: string()
    .min(6, "Carnet muy corto")
    .max(20, "Carnet muy largo"),
  fechaNacimiento: string().refine(
    (val) => !isNaN(Date.parse(val)),
    "Fecha inválida"
  ),
  departamento: string().min(2, "Campo requerido"),
  provincia: string().min(2, "Campo requerido"),
  municipio: string().min(2, "Campo requerido"),
});
type FormData = {
  nombreCompleto: string;
  carnetIdentidad: string;
  fechaNacimiento: string;
  departamento: string;
  provincia: string;
  municipio: string;
};

interface Props {
  initialData?: FormData;
  onCancel: () => void;
  onSave: (data: FormData) => Promise<void>;
}

export default function ParticipantForm({
  initialData,
  onCancel,
  onSave,
}: Props) {
  const { showSnack } = useSnack();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: FormData) => {
    try {
      await onSave(data);
    } catch (e: any) {
      const msg = e.response?.data?.message || "Error al guardar participante";
      showSnack(msg, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>
        {initialData ? "Editar participante" : "Nuevo participante"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Nombre completo"
            {...register("nombreCompleto")}
            error={!!errors.nombreCompleto}
            helperText={errors.nombreCompleto?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Carnet de Identidad"
            {...register("carnetIdentidad")}
            error={!!errors.carnetIdentidad}
            helperText={errors.carnetIdentidad?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Fecha de Nacimiento"
            type="date"
            {...register("fechaNacimiento")}
            error={!!errors.fechaNacimiento}
            helperText={errors.fechaNacimiento?.message}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Departamento"
            {...register("departamento")}
            error={!!errors.departamento}
            helperText={errors.departamento?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Provincia"
            {...register("provincia")}
            error={!!errors.provincia}
            helperText={errors.provincia?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Municipio"
            {...register("municipio")}
            error={!!errors.municipio}
            helperText={errors.municipio?.message}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {initialData ? "Guardar" : "Crear"}
        </Button>
      </DialogActions>
    </form>
  );
}
