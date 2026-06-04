import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

    const [cedula, setCedula] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = await login(
                cedula,
                password
            );

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "usuario",
                JSON.stringify(data.usuario)
            );

            navigate("/dashboard");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Error"
            );
        }
    };

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-4">

                    <div className="card">

                        <div className="card-body">

                            <h3 className="text-center mb-4">
                                Polla Mundial 2026
                            </h3>

                            <form onSubmit={handleSubmit}>

                                <input
                                    className="form-control mb-3"
                                    placeholder="Cédula"
                                    value={cedula}
                                    onChange={(e) =>
                                        setCedula(e.target.value)
                                    }
                                />

                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <button
                                    className="btn btn-primary w-100"
                                >
                                    Ingresar
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;