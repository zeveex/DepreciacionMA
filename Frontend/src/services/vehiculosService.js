import api from "./api";

export const obtenerVehiculos = () => {
    return api.get("/vehiculos");
};

export const obtenerVehiculo = (id) => {
    return api.get(`/vehiculos/${id}`);
};

export const crearVehiculo = (vehiculo) => {
    return api.post("/vehiculos", vehiculo);
};

export const actualizarVehiculo = (id, vehiculo) => {
    return api.put(`/vehiculos/${id}`, vehiculo);
};

export const eliminarVehiculo = (id) => {
    return api.delete(`/vehiculos/${id}`);
};

export const calcularDepreciacion = (datos) => {
    return api.post("/vehiculos/depreciacion", datos);
};