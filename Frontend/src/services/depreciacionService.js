import api from "../api/axiosClient";

export const calcularDepreciacion = (data) =>
    api.post("/depreciacion/calcular", data);

export const generarHistorial = (idActivo) =>
    api.post(`/depreciacion/generar-historial/${idActivo}`);

export const obtenerHistorial = (idActivo) =>
    api.get(`/depreciacion/historial/${idActivo}`);

export const generarReporte = (idActivo) =>
    api.get(`/depreciacion/reporte/${idActivo}/pdf`, {
        responseType: "blob"
    });