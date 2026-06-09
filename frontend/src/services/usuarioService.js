import apiClient from "./httpClient";

export const crearUsuario = async (data) => {
    const response = await apiClient.post("/usuarios", data);
    return response.data;
};

export const obtenerUsuarios = async () => {
    const response = await apiClient.get("/usuarios");
    return response.data;
};

export const actualizarUsuario = async (id, data) => {
    const response = await apiClient.put(`/usuarios/${id}`, data);
    return response.data;
};

export const borrarUsuario = async (id) => {
    const response = await apiClient.delete(`/usuarios/${id}`);
    return response.data;
};