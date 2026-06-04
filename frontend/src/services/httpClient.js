import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:5000/api"
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const validToken = token && token !== "null" && token !== "undefined";

    if (validToken) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
        };
    } else {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
    }

    return config;
});

export default apiClient;
