'use client';
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { PuntajesAPI } from "@/lib/api";

interface Score {
  id: string;
  participante: string;
  puntaje: number;
  departamento: string;
  provincia: string;
  municipio: string;
}

export default function PublicScores() {
  const [rows, setRows] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    setLoading(true);
    try {
      // Requiere que tu endpoint público devuelva estos campos
      const res = await PuntajesAPI.listWithDetails?.();
      setRows(res?.data || []);
    } catch {
      // En público usualmente no mostramos snackbars
      console.error("Error al cargar puntajes públicos");
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "participante", headerName: "Participante", flex: 1, minWidth: 150 },
    { field: "puntaje", headerName: "Puntaje", type: "number", width: 120 },
    { field: "departamento", headerName: "Departamento", width: 130 },
    { field: "provincia", headerName: "Provincia", width: 130 },
    { field: "municipio", headerName: "Municipio", width: 130 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          COMPETENCIA DE ROBOTS SUMO
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Consulta aquí los puntajes finales de la competencia
        </Typography>
      </Box>

      <Box sx={{ height: 600, width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(r) => r.id}
            slots={{ toolbar: GridToolbar }}
            initialState={{
              sorting: {
                sortModel: [{ field: "puntaje", sort: "desc" }],
              },
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            pagination
            disableRowSelectionOnClick
          />
        )}
      </Box>
    </Container>
  );
}
