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
import { ParticipantsAPI } from "@/lib/api";
import ParticipantForm from "@/components/ParticipantForm";
import { useSnack } from "@/components/SnackbarProvider";

interface Participant {
  id: string;
  nombreCompleto: string;
  carnetIdentidad: string;
  fechaNacimiento: string;
  departamento: string;
  provincia: string;
  municipio: string;
}

export default function ParticipantsPage() {
  const { showSnack } = useSnack();
  const [rows, setRows] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Participant | null>(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  async function fetchParticipants() {
    setLoading(true);
    try {
      const res = await ParticipantsAPI.list();
      setRows(res.data[0]);
    } catch {
      showSnack("Error al cargar participantes", "error");
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

  const processRowUpdate = async (newRow: Participant) => {
    try {
      await ParticipantsAPI.update(newRow.id, {
        nombreCompleto: newRow.nombreCompleto,
        carnetIdentidad: newRow.carnetIdentidad,
        fechaNacimiento: newRow.fechaNacimiento,
        departamento: newRow.departamento,
        provincia: newRow.provincia,
        municipio: newRow.municipio,
      });
      showSnack("Participante actualizado", "success");
      return newRow;
    } catch (e: any) {
      showSnack(e.response?.data?.message || "Error al actualizar", "error");
      throw e;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar participante?")) return;
    try {
      await ParticipantsAPI.remove(id);
      showSnack("Participante eliminado", "info");
      fetchParticipants();
    } catch {
      showSnack("Error al eliminar participante", "error");
    }
  };

  const columns: GridColDef[] = [
    { field: "nombreCompleto", headerName: "Nombre Completo", flex: 1, minWidth: 150, editable: true },
    { field: "carnetIdentidad", headerName: "CI", width: 120, editable: true },
    { field: "departamento", headerName: "Departamento", width: 130, editable: true },
    { field: "provincia", headerName: "Provincia", width: 130, editable: true },
    { field: "municipio", headerName: "Municipio", width: 130, editable: true },
    { field: "fechaNacimiento", headerName: "Fecha Nac.", width: 130, editable: true },
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

  const handleSaveNew = async (data: Omit<Participant, "id">) => {
    try {
      await ParticipantsAPI.create(data);
      showSnack("Participante creado", "success");
      setDialogOpen(false);
      fetchParticipants();
    } catch (e: any) {
      showSnack(e.response?.data?.message || "Error al crear participante", "error");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Participantes
      </Typography>
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        + Agregar participante
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
            pageSizeOptions={[5, 10, 20]}
            pagination
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={(model) => setRowModesModel(model)}
            processRowUpdate={processRowUpdate}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
              sorting: { sortModel: [{ field: "nombreCompleto", sort: "asc" }] }
            }}
          />
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <ParticipantForm
          initialData={
            editTarget
              ? {
                  nombreCompleto: editTarget.nombreCompleto,
                  carnetIdentidad: editTarget.carnetIdentidad,
                  fechaNacimiento: editTarget.fechaNacimiento,
                  departamento: editTarget.departamento,
                  provincia: editTarget.provincia,
                  municipio: editTarget.municipio,
                }
              : undefined
          }
          onCancel={() => setDialogOpen(false)}
          onSave={handleSaveNew}
        />
      </Dialog>
    </Container>
  );
}
