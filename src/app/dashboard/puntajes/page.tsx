'use client';
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridActionsCellItem,
  GridRowModes,
  GridToolbar
} from "@mui/x-data-grid";
import { PuntajesAPI } from "@/lib/api";
import { useSnack } from "@/components/SnackbarProvider";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

interface Score {
  id: string;
  participante: string;
  puntaje: number;
  departamento: string;
  provincia: string;
  municipio: string;
}

export default function PuntajesPage() {
  const { showSnack } = useSnack();
  const [rows, setRows] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    setLoading(true);
    try {
      // Asume que tu endpoint retorna un array con los campos id, participante, puntaje, departamento, provincia, municipio
      const res = await PuntajesAPI.listWithDetails?.();
      setRows(res?.data || []);
    } catch {
      showSnack("Error al cargar puntajes", "error");
    } finally {
      setLoading(false);
    }
  };

  const processRowUpdate = async (newRow: Score) => {
    try {
      await PuntajesAPI.update(newRow.id, { puntaje: newRow.puntaje });
      showSnack("Puntaje actualizado", "success");
      return newRow;
    } catch {
      showSnack("Error al actualizar puntaje", "error");
      throw new Error();
    }
  };

  const handleSaveClick = (id: string) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: string) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true } });
  };

  const handleEditClick = (id: string) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const columns: GridColDef[] = [
    { field: "participante", headerName: "Participante", flex: 1, minWidth: 150 },
    { field: "puntaje", headerName: "Puntaje", type: "number", width: 120, editable: true },
    { field: "departamento", headerName: "Departamento", width: 130 },
    { field: "provincia", headerName: "Provincia", width: 130 },
    { field: "municipio", headerName: "Municipio", width: 130 },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        return isInEditMode
          ? [
              <GridActionsCellItem key="save" icon={<SaveIcon />} label="Guardar" onClick={handleSaveClick(id as string)} />,
              <GridActionsCellItem key="cancel" icon={<CancelIcon />} label="Cancelar" onClick={handleCancelClick(id as string)} />,
            ]
          : [
              <GridActionsCellItem key="edit" icon={<SaveIcon />} label="Editar" onClick={handleEditClick(id as string)} />,
            ];
      },
    },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Puntajes
      </Typography>
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
            loading={loading}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={(model) => setRowModesModel(model)}
            processRowUpdate={processRowUpdate}
            disableRowSelectionOnClick
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
          />
        )}
      </Box>
    </Container>
  );
}
