import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const cerrarSesion = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        navigate("/");
    };

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const esAdmin = usuario?.rol === "admin";

    return (
        <nav className="navbar navbar-expand-lg mundial-navbar">

            <div className="container-fluid">

                <span className="navbar-brand mundial-logo">
                    🏆 POLLA MUNDIALISTA 2026
                </span>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mainNavbar">
                    <div className="navbar-nav me-auto mb-2 mb-lg-0">
                        <NavLink
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            to="/dashboard"
                        >
                            🏠 Inicio
                        </NavLink>

                        <NavLink
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            to="/partidos"
                        >
                            ⚽ Partidos
                        </NavLink>

                        <NavLink
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            to="/ranking"
                        >
                            🥇 Ranking
                        </NavLink>

                        <NavLink
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            to="/perfil"
                        >
                            👤 Perfil
                        </NavLink>

                        {esAdmin && (
                            <>
                                <NavLink
                                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                    to="/admin/equipos"
                                >
                                    🌎 Equipos
                                </NavLink>

                                <NavLink
                                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                    to="/admin/partidos"
                                >
                                    🛠️ Partidos Admin
                                </NavLink>

                                <NavLink
                                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                    to="/admin/usuarios"
                                >
                                    👥 Usuarios
                                </NavLink>
                            </>
                        )}

                        <NavLink
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            to="/pronosticos"
                        >
                            🎯 Pronósticos
                        </NavLink>

                        {/* Mobile CTA: visible inside collapse on small screens */}
                        <NavLink
                            className={({ isActive }) => isActive ? "nav-link d-lg-none" : "nav-link d-lg-none"}
                            to="/campeon"
                        >
                            <span className="btn btn-warning btn-sm w-100 text-dark">🏆 Mi Campeón</span>
                        </NavLink>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <NavLink
                            className="btn btn-warning btn-sm d-none d-lg-inline-flex"
                            to="/campeon"
                        >
                            Escoger mi campeón
                        </NavLink>

                        <button
                            className="btn btn-danger btn-sm"
                            onClick={cerrarSesion}
                        >
                            Salir
                        </button>
                    </div>
                </div>

            </div>

        </nav>
    );
}

export default Navbar;