import apiClient from "./httpClient";

export const guardarCampeon = async (data) => {
    const response = await apiClient.post("/campeon", data);
    return response.data;
};

export const obtenerCampeonUsuario = async (usuarioId) => {
    try {
        const response = await apiClient.get(`/campeon/usuario/${usuarioId}`);
        return response.data.campeon || null;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};