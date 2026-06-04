import axios from "axios";

const API = "http://127.0.0.1:5000/api/auth";

export const login = async (cedula, password) => {

    const response = await axios.post(
        `${API}/login`,
        {
            cedula,
            password
        }
    );

    return response.data;
};