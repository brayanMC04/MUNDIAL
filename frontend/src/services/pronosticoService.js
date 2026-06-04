import axios from "axios";

const API = "http://127.0.0.1:5000/api/pronosticos";

export const guardarPronostico = async (data) => {
    const response = await axios.post(API, data);
    return response.data;
};