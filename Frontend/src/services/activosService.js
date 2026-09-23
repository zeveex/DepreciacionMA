import api from "../api/axiosClient";

export const obtenerActivos = () => api.get("/activos");

export const obtenerActivo = (id) =>
    api.get(`/activos/${id}`);

export const crearActivo = (data) =>
    api.post("/activos", data);

export const actualizarActivo = (id, data) =>
    api.put(`/activos/${id}`, data);

export const eliminarActivo = (id) =>
    api.delete(`/activos/${id}`);