'use client';
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowModesModel,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

import { TutorsAPI } from "@/lib/api";
import ParticipantForm from "@/components/ParticipantForm";
import { useSnack } from "@/components/SnackbarProvider";

// Puedes reutilizar ParticipantForm si los datos son los mismos (nombreCompleto, carnetIdentidad). 
// Si necesitas un formulario diferente, crea TutorForm equivalente.

interface Tutor {
  id: string;
  nombreCompleto: string;
  carnetIdentidad: string;
}

export default function TutorsPage() {
  const { showSnack } = useSnack();
  const [rows, setRows] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tutor | null>(null);

  useEffect(() => {
    fetchTutors();
  }, []);

  async function fetchTutors() {
    setLoading(true);
    try {
      const res = await TutorsAPI.list();
      setRows(res.data[0]);
    } catch {
      showSnack("Error al cargar tutores", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (id: string) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: string) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: string) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow: Tutor) => {
    try {
      await TutorsAPI.update(newRow.id, {
        nombreCompleto: newRow.nombreCompleto,
        carnetIdentidad: newRow.carnetIdentidad,
      });
      showSnack("Tutor actualizado", "success");
      return newRow;
    } catch (e: any) {
      showSnack(e.response?.data?.message || "Error al actualizar tutor", "error");
      throw e;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar tutor?")) return;
    try {
      await TutorsAPI.remove(id);
      showSnack("Tutor eliminado", "info");
      fetchTutors();
    } catch {
      showSnack("Error al eliminar tutor", "error");
    }
  };

  const columns: GridColDef[] = [
    { field: "nombreCompleto", headerName: "Nombre Completo", flex: 1, minWidth: 150, editable: true },
    { field: "carnetIdentidad", headerName: "CI", width: 120, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 120,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        return isInEditMode
          ? [
              <GridActionsCellItem key="save" icon={<SaveIcon />} label="Guardar" onClick={handleSaveClick(id as string)} />,
              <GridActionsCellItem key="cancel" icon={<CancelIcon />} label="Cancelar" onClick={handleCancelClick(id as string)} />,
            ]
          : [
              <GridActionsCellItem key="edit" icon={<EditIcon />} label="Editar" onClick={handleEditClick(id as string)} />,
              <GridActionsCellItem key="delete" icon={<DeleteIcon />} label="Eliminar" onClick={() => handleDelete(id as string)} />,
            ];
      },
    },
  ];

  const handleAdd = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const handleSaveNew = async (data: Omit<Tutor, "id">) => {
    try {
      await TutorsAPI.create(data);
      showSnack("Tutor creado", "success");
      setDialogOpen(false);
      fetchTutors();
    } catch (e: any) {
      showSnack(e.response?.data?.message || "Error al crear tutor", "error");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tutores
      </Typography>
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        + Agregar tutor
      </Button>
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
            pagination
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={(model) => setRowModesModel(model)}
            processRowUpdate={processRowUpdate}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            initialState={{
              pagination: { 
                paginationModel: { pageSize: 5, page: 0 }
              },
              sorting: { sortModel: [{ field: "nombreCompleto", sort: "asc" }] }
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <ParticipantForm
          // Reutiliza ParticipantForm (nombre+CI). Si necesitas formulario distinto, crea TutorForm similar.
          initialData={editTarget ? {
            nombreCompleto: editTarget.nombreCompleto,
            carnetIdentidad: editTarget.carnetIdentidad,
            fechaNacimiento: "", departamento: "", provincia: "", municipio: ""
          } : undefined}
          onCancel={() => setDialogOpen(false)}
          onSave={handleSaveNew}
        />
      </Dialog>
    </Container>
  );
}
