import apiClient from "./httpClient";

export const obtenerPartidos = async () => {
    const response = await apiClient.get("/partidos");
    return response.data;
};

export const crearPartido = async (partido) => {
    const response = await apiClient.post("/partidos", partido);
    return response.data;
};

export const actualizarResultadoPartido = async (partidoId, resultado) => {
    const response = await apiClient.put(`/partidos/${partidoId}`, resultado);
    return response.data;
};