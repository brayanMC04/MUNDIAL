import apiClient from "./httpClient";

export const obtenerEquipos = async () => {
    const response = await apiClient.get("/equipos");
    return response.data;
};

export const obtenerEquiposExternos = async () => {
    const response = await apiClient.get("/equipos/externos");
    return response.data;
};

export const crearEquipo = async (data) => {
    const response = await apiClient.post("/equipos", data);
    return response.data;
};