import apiClient from "./httpClient";

export const guardarCampeon = async (data) => {
    const response = await apiClient.post("/campeon", data);
    return response.data;
};