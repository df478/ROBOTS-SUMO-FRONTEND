import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/(^|; )token=([^;]+)/);
    const token = match?.[2];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const ConfigAPI = {
  saveSettings: (data: {
    numeroClasificados: number;
    numeroPistas: number;
  }) => api.post("/participantes", data),
  iniciarCompetencia: () => api.post("/competencia/iniciar"),
  detenerCompetencia: () => api.post("/competencia/detener"),
}
// =======================
// FALTAN ESTOS ENDPOINTS
// =======================
//POST /competencia/iniciar
//POST /competencia/detener CompetitionController
//generateAuto() RondasAPI

// =======================
// PARTICIPANTS API (ya existente)
// =======================

export const ParticipantsAPI = {
  list: () => api.get("/participantes"),
  get: (id: string) => api.get(`/participantes/${id}`),
  create: (data: {
    nombreCompleto: string;
    carnetIdentidad: string;
    fechaNacimiento: string;
    departamento: string;
    provincia: string;
    municipio: string;
  }) => api.post("/participantes", data),
  update: (
    id: string,
    data: {
      nombreCompleto?: string;
      carnetIdentidad?: string;
      fechaNacimiento?: string;
      departamento?: string;
      provincia?: string;
      municipio?: string;
    }
  ) => api.patch(`/participantes/${id}`, data),
  remove: (id: string) => api.patch(`/participantes/soft-delete/${id}`),
  restore: (id: string) => api.patch(`/participantes/restore/${id}`),
  delete: (id: string) => api.delete(`/participantes/eliminar/${id}`),
};

// =======================
// TUTORS API
// =======================

export const TutorsAPI = {
  list: () => api.get("/tutores"),
  get: (id: string) => api.get(`/tutores/${id}`),
  create: (data: {
    nombreCompleto: string;
    carnetIdentidad: string;
  }) => api.post("/tutores", data),
  update: (
    id: string,
    data: {
      nombreCompleto?: string;
      carnetIdentidad?: string;
    }
  ) => api.patch(`/tutores/${id}`, data),
  remove: (id: string) => api.patch(`/tutores/soft-delete/${id}`),
  restore: (id: string) => api.patch(`/tutores/restore/${id}`),
  delete: (id: string) => api.delete(`/tutores/eliminar/${id}`),
};

// =======================
// EQUIPOS API
// =======================

export const EquiposAPI = {
  list: () => api.get("/equipos"),
  get: (id: string) => api.get(`/equipos/${id}`),
  create: (data: { nombreEquipo: string }) => api.post("/equipos", data),
  update: (
    id: string,
    data: { nombreEquipo?: string }
  ) => api.patch(`/equipos/${id}`, data),
  remove: (id: string) => api.patch(`/equipos/soft-delete/${id}`),
  restore: (id: string) => api.patch(`/equipos/restore/${id}`),
  delete: (id: string) => api.delete(`/equipos/eliminar/${id}`),
  listWithDetails: () => api.get("/equipos/details"),
};

// =======================
// EQUIPOS PARTICIPANTES API
// =======================

export const EquiposParticipantesAPI = {
  list: () => api.get("/equiposParticipantes"),
  get: (id: string) => api.get(`/equiposParticipantes/${id}`),
  create: (data: {
    equipoId: number;
    participanteId: number;
  }) => api.post("/equiposParticipantes", data),
  update: (
    id: string,
    data: {
      equipo?: number;
      participante?: number;
    }
  ) => api.patch(`/equiposParticipantes/${id}`, data),
  remove: (id: string) => api.patch(`/equiposParticipantes/soft-delete/${id}`),
  restore: (id: string) => api.patch(`/equiposParticipantes/restore/${id}`),
  delete: (id: string) => api.delete(`/equiposParticipantes/eliminar/${id}`),
};

// =======================
// PISTAS API
// =======================

export const PistasAPI = {
  list: () => api.get("/pistas"),
  get: (id: string) => api.get(`/pistas/${id}`),
  create: (data: { nombrePista: string }) => api.post("/pistas", data),
  update: (
    id: string,
    data: { nombrePista?: string }
  ) => api.patch(`/pistas/${id}`, data),
  remove: (id: string) => api.patch(`/pistas/soft-delete/${id}`),
  restore: (id: string) => api.patch(`/pistas/restore/${id}`),
  delete: (id: string) => api.delete(`/pistas/eliminar/${id}`),
};

// =======================
// PUNTAJES API
// =======================

export const PuntajesAPI = {
  list: () => api.get("/puntajes"),
  get: (id: string) => api.get(`/puntajes/${id}`),
  create: (data: {
    puntaje: number;
    rondaId: number;
    equipoId: number;
  }) => api.post("/puntajes", data),
  update: (
    id: string,
    data: {
      puntaje?: number;
      ronda?: number;
      equipo?: number;
    }
  ) => api.patch(`/puntajes/${id}`, data),
  remove: (id: string) => api.patch(`/puntajes/soft-delete/${id}`),
  restore: (id: string) => api.patch(`/puntajes/restore/${id}`),
  delete: (id: string) => api.delete(`/puntajes/eliminar/${id}`),
  listWithDetails: () => api.get("/puntajes/details"),
};

// =======================
// RONDAS API
// =======================

export const RondasAPI = {
  list: () => api.get("/rondas"),
  get: (id: string) => api.get(`/rondas/${id}`),
  create: (data: {
    estado: string;
    pistaId: number;
    equipoRojoId: number;
    equipoAzulId: number;
  }) => api.post("/rondas", data),
  update: (
    id: string,
    data: {
      estado?: string;
      pista?: number;
      equipo_rojo?: number;
      equipo_azul?: number;
    }
  ) => api.patch(`/rondas/${id}`, data),
  remove: (id: string) => api.patch(`/rondas/soft-delete/${id}`),
  restore: (id: string) => api.patch(`/rondas/restore/${id}`),
  delete: (id: string) => api.delete(`/rondas/eliminar/${id}`),
  generateAuto: () => api.post("/rondas/generar"),
};

// =======================
// USUARIOS API
// =======================

export const UsuariosAPI = {
  list: () => api.get("/usuarios"),
  get: (id: string) => api.get(`/usuarios/${id}`),
  create: (data: {
    username: string;
    email: string;
    password: string;
    rol?: string;
  }) => api.post("/usuarios", data),
  update: (
    id: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      rol?: string;
    }
  ) => api.patch(`/usuarios/${id}`, data),
  remove: (id: string) => api.patch(`/usuarios/soft-delete/${id}`),
  restore: (id: string) => api.patch(`/usuarios/restore/${id}`),
  delete: (id: string) => api.delete(`/usuarios/eliminar/${id}`),
};

// =======================
// AUTH API
// =======================

export const AuthAPI = {
  login: (data: {
    email: string;
    password: string;
  }) => api.post("/auth/login", data),
};
