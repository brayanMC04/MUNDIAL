import apiClient from "./httpClient";

export const crearUsuario = async (data) => {
    const response = await apiClient.post("/usuarios", data);
    return response.data;
};

export const obtenerUsuarios = async () => {
    const response = await apiClient.get("/usuarios");
    return response.data;
};
