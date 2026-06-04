import axios from "axios";

const API = "http://127.0.0.1:5000/api/partidos";

export const obtenerPartidos = async () => {
    const response = await axios.get(API);
    return response.data;
};

export const crearPartido = async (partido) => {
    const response = await axios.post(API, partido);
    return response.data;
};