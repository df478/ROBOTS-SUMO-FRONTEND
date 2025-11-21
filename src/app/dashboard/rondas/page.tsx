"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowModesModel,
  GridColDef,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { RondasAPI, PistasAPI, EquiposAPI, PuntajesAPI } from "@/lib/api";
import { useSnack } from "@/components/SnackbarProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { object, string } from "zod";

const schema = object({
  estado: string().min(3),
  pistaId: string().min(1),
  equipoRojoId: string().min(1),
  equipoAzulId: string().min(1),
});
type FormCreate = {
  estado: string;
  pistaId: string;
  equipoRojoId: string;
  equipoAzulId: string;
};

interface Equipo {
  id: string | number;
  nombreEquipo?: string;
}

interface Pista {
  id: string | number;
  nombrePista?: string;
}

interface Round {
  id: string;
  estado: string;
  pista: Pista;
  equipoRojo: Equipo;
  equipoAzul: Equipo;
}

export default function RondasPage() {
  const { showSnack } = useSnack();
  const [rows, setRows] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmGen, setConfirmGen] = useState(false);
  const [pistas, setPistas] = useState<{ id: string; nombre: string }[]>([]);
  const [equipos, setEquipos] = useState<{ id: string; nombre: string }[]>([]);
  const [enterPoints, setEnterPoints] = useState<Round | null>(null);
  const [points, setPoints] = useState({ rojo: 0, azul: 0 });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormCreate>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    loadOptions();
    fetchRounds();
  }, []);

  async function loadOptions() {
    try {
      const [pRes, eRes] = await Promise.all([
        PistasAPI.list(),
        EquiposAPI.list(),
      ]);
      setPistas(pRes.data[0]);
      setEquipos(eRes.data[0]);
    } catch {
      showSnack("Error al cargar pistas/equipos", "error");
    }
  }

  async function fetchRounds() {
    setLoading(true);
    try {
      const res = await RondasAPI.list();
      console.log("Rondas:", res.data[0]);
      const enriched = await Promise.all(
        res.data[0].map(async (r: any) => {
          const p = await PistasAPI.get("" + r.pista.id);
          const eR = await EquiposAPI.get("" + r.equipo_rojo.id);
          const eA = await EquiposAPI.get("" + r.equipo_azul.id);
          return {
            id: "" + r.id,
            estado: r.estado,
            pista: p.data.nombrePista,
            equipoRojo: eR.data.nombreEquipo,
            equipoAzul: eA.data.nombreEquipo,
          };
        })
      );
      setRows(enriched);
    } catch {
      showSnack("Error al cargar rondas", "error");
    } finally {
      setLoading(false);
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "estado", headerName: "Estado", editable: true, width: 120 },
    { field: "pista", headerName: "Pista", editable: true, width: 120 },
    { field: "equipoRojo", headerName: "Rojo", editable: true, width: 120 },
    { field: "equipoAzul", headerName: "Azul", editable: true, width: 120 },
    {
      field: "accionesRonda",
      headerName: "Acción",
      width: 160,
      renderCell: (params) => {
        const ronda = rows.find((r) => r.id === params.row.id);
        if (!ronda) return null;
        const isRunning = ronda.estado === "en_curso";
        return (
          <Button
            variant="outlined"
            color={isRunning ? "warning" : "success"}
            onClick={async () => {
              try {
                await RondasAPI.update(ronda.id, {
                  estado: isRunning ? "pendiente" : "en_curso",
                });
                showSnack(
                  `Ronda ${isRunning ? "detenida" : "iniciada"}`,
                  "info"
                );
                fetchRounds();
              } catch {
                showSnack("Error al actualizar estado de la ronda", "error");
              }
            }}
          >
            {isRunning ? "Detener" : "Iniciar"}
          </Button>
        );
      },
    },
    {
      field: "ingresar",
      headerName: "Puntos",
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          onClick={async () => {
            try {
              const res = await RondasAPI.get(String(params.row.id));
              const r: Round = {
                id: String(res.data.id),
                estado: res.data.estado,
                pista: res.data.pista,
                equipoRojo: res.data.equipo_rojo,
                equipoAzul: res.data.equipo_azul,
              };
              setEnterPoints(r);
              setPoints({ rojo: 0, azul: 0 });
            } catch {
              showSnack("Error al cargar datos de la ronda", "error");
            }
          }}
        >
          Ingresar
        </Button>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 120,
      getActions: ({ id }) => {
        const isEdit = rowModesModel[id]?.mode === GridRowModes.Edit;
        return isEdit
          ? [
              <GridActionsCellItem
                key="save"
                icon={<SaveIcon />}
                label="Guardar"
                onClick={() =>
                  setRowModesModel({ [id]: { mode: GridRowModes.View } })
                }
              />,
              <GridActionsCellItem
                key="cancel"
                icon={<CancelIcon />}
                label="Cancelar"
                onClick={() =>
                  setRowModesModel({
                    [id]: {
                      mode: GridRowModes.View,
                      ignoreModifications: true,
                    },
                  })
                }
              />,
            ]
          : [
              <GridActionsCellItem
                key="edit"
                icon={<EditIcon />}
                label="Editar"
                onClick={() =>
                  setRowModesModel({ [id]: { mode: GridRowModes.Edit } })
                }
              />,
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                label="Eliminar"
                onClick={() => handleDelete("" + id)}
              />,
            ];
      },
    },
  ];

  async function handleDelete(id: string) {
    if (!confirm("Eliminar ronda?")) return;
    try {
      await RondasAPI.remove(id);
      showSnack("Ronda eliminada", "info");
      fetchRounds();
    } catch {
      showSnack("Error al eliminar", "error");
    }
  }

  async function processRowUpdate(newRow: any) {
    try {
      await RondasAPI.update(newRow.id, { estado: newRow.estado });
      showSnack("Ronda actualizada", "success");
      return newRow;
    } catch {
      showSnack("Error al actualizar", "error");
      return rows.find((r) => r.id === newRow.id)!;
    }
  }

  async function onCreate(data: FormCreate) {
    try {
      await RondasAPI.create({
        estado: data.estado,
        pistaId: Number(data.pistaId),
        equipoRojoId: Number(data.equipoRojoId),
        equipoAzulId: Number(data.equipoAzulId),
      });
      showSnack("Ronda creada", "success");
      setOpenCreate(false);
      fetchRounds();
    } catch {
      showSnack("Error al crear", "error");
    }
  }

  // Generate rounds automatically
  async function handleGenerate() {
    try {
      await RondasAPI.generateAuto(); // Pending endpoint: POST /rondas/generar
      showSnack("Rondas generadas exitosamente", "success");
      fetchRounds();
    } catch (e: any) {
      showSnack(
        e.response?.data?.message || "Error al generar rondas",
        "error"
      );
    } finally {
      setConfirmGen(false);
    }
  }

  async function savePoints() {
    if (!enterPoints) return;
    try {
      // Ingresa puntaje de ambos equipos
      await PuntajesAPI.create({
        puntaje: points.rojo,
        rondaId: Number(enterPoints.id),
        equipoId: Number(enterPoints.equipoRojo.id),
      });
      await PuntajesAPI.create({
        puntaje: points.azul,
        rondaId: Number(enterPoints.id),
        equipoId: Number(enterPoints.equipoAzul.id),
      });
      // Finaliza la ronda
      await RondasAPI.update(enterPoints.id, { estado: "finalizada" });
      showSnack("Puntos ingresados y ronda finalizada", "success");
      setEnterPoints(null);
      fetchRounds();
    } catch {
      showSnack("Error al guardar puntos", "error");
    }
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Gestión de Rondas
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          + Crear ronda
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setConfirmGen(true)}
        >
          Generar rondas automáticas
        </Button>
      </Box>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          editMode="row"
          rowModesModel={rowModesModel}
          processRowUpdate={processRowUpdate}
          onRowModesModelChange={(m) => setRowModesModel(m)}
          getRowId={(r) => r.id}
        />
      </div>

      {/* Confirmación generación automática */}
      <Dialog open={confirmGen} onClose={() => setConfirmGen(false)}>
        <DialogTitle>Generar rondas automáticamente</DialogTitle>
        <DialogContent>
          <Typography>
            Esto creará rondas agrupando aleatoriamente participantes en equipos
            de 2 por equipo, simultáneos en cada pista. ¿Deseas continuar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmGen(false)}>Cancelar</Button>
          <Button onClick={handleGenerate} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!enterPoints} onClose={() => setEnterPoints(null)}>
        <DialogTitle sx={{ mb: 2 }}>
          Ingresar puntos - Ronda {enterPoints?.id}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={`${enterPoints?.equipoRojo.nombreEquipo} puntos`}
            type="number"
            value={points.rojo}
            onChange={(e) =>
              setPoints((p) => ({ ...p, rojo: Number(e.target.value) }))
            }
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label={`${enterPoints?.equipoAzul.nombreEquipo} puntos`}
            type="number"
            value={points.azul}
            onChange={(e) =>
              setPoints((p) => ({ ...p, azul: Number(e.target.value) }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnterPoints(null)}>Cancelar</Button>
          <Button variant="contained" onClick={savePoints}>
            Guardar y finalizar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Crear Ronda</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onCreate)}
            sx={{ mt: 1 }}
          >
            <TextField
              fullWidth
              label="Estado"
              {...register("estado")}
              error={!!errors.estado}
              helperText={errors.estado?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Pista"
              {...register("pistaId")}
              error={!!errors.pistaId}
              helperText={errors.pistaId?.message}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="" />
              {pistas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Equipo Rojo"
              {...register("equipoRojoId")}
              error={!!errors.equipoRojoId}
              helperText={errors.equipoRojoId?.message}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="" />
              {equipos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Equipo Azul"
              {...register("equipoAzulId")}
              error={!!errors.equipoAzulId}
              helperText={errors.equipoAzulId?.message}
              SelectProps={{ native: true }}
            >
              <option value="" />
              {equipos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </TextField>
            <DialogActions>
              <Button
                onClick={() => setOpenCreate(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                Crear
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
