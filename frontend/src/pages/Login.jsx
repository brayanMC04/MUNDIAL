import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

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
        <div className="login-page">

            <div className="login-overlay">

                <div className="login-card">

                    <div className="login-header">

                        <div className="worldcup-icon">
                            🏆
                        </div>

                        <h1>
                            POLLA MUNDIALISTA
                        </h1>

                        <h2>
                            FIFA WORLD CUP 2026
                        </h2>

                        <p>
                            United States • Canada • Mexico
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <input
                            className="form-control login-input"
                            placeholder="Ingrese su cédula"
                            value={cedula}
                            onChange={(e) =>
                                setCedula(e.target.value)
                            }
                        />

                        <input
                            type="password"
                            className="form-control login-input"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        <button
                            className="btn btn-primary login-btn"
                        >
                            ⚽ INGRESAR
                        </button>

                    </form>

                    <div className="login-footer">

                        <span>🇺🇸</span>
                        <span>🇨🇦</span>
                        <span>🇲🇽</span>

                    </div>

                </div>

            </div>

        </div>
    );
    }

export default Login;