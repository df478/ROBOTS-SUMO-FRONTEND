'use client';
import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography, CircularProgress } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { useSnack } from "@/components/SnackbarProvider";
import { EquiposAPI } from "@/lib/api";

interface EquipoDetail {
  id: string;
  nombreEquipo: string;
  participantes: string; // nombres concatenados
  tutores: string;       // nombres concatenados
}

export default function EquiposPage() {
  const { showSnack } = useSnack();
  const [rows, setRows] = useState<EquipoDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    setLoading(true);
    try {
      const res = await EquiposAPI.listWithDetails!(); // Stubbed endpoint
      setRows(res.data);
    } catch (e: any) {
      showSnack(e.response?.data?.message || "Error cargando equipos", "error");
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "nombreEquipo", headerName: "Equipo", flex: 1, minWidth: 150 },
    { field: "participantes", headerName: "Participantes", flex: 2, minWidth: 200 },
    { field: "tutores", headerName: "Tutores", flex: 1, minWidth: 150 },
  ];

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>Equipos</Typography>
      <Box sx={{ height: 500, width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(r) => r.id}
            pageSizeOptions={[5, 10, 20]}
            pagination
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: { sortModel: [{ field: "nombreEquipo", sort: "asc" }] }
            }}
          />
        )}
      </Box>
      <Button variant="contained" sx={{ mt: 2 }} onClick={fetchEquipos}>
        Refrescar
      </Button>
    </Container>
  );
}
