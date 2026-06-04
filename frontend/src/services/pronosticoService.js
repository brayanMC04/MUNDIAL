import apiClient from "./httpClient";

export const guardarPronostico = async (data) => {
    const response = await apiClient.post("/pronosticos", data);
    return response.data;
};

export const obtenerPronosticosUsuario = async (usuarioId) => {
    const response = await apiClient.get(`/pronosticos/usuario/${usuarioId}`);
    return response.data;
};