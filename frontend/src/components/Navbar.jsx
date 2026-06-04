import { Link, useNavigate } from "react-router-dom";

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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container-fluid">

                <span className="navbar-brand">
                    Polla Mundialista 2026
                </span>

                <div className="navbar-nav">

                    <Link
                        className="nav-link"
                        to="/dashboard"
                    >
                        Dashboard
                    </Link>

                    <Link
                        className="nav-link"
                        to="/partidos"
                    >
                        Partidos
                    </Link>

                    <Link
                        className="nav-link"
                        to="/campeon"
                    >
                        Mi Campeón
                    </Link>

                    <Link
                        className="nav-link"
                        to="/ranking"
                    >
                        Ranking
                    </Link>

                    <Link
                        className="nav-link"
                        to="/perfil"
                    >
                        Perfil
                    </Link>

                    {esAdmin && (
                        <>
                            <Link
                                className="nav-link"
                                to="/admin/equipos"
                            >
                                Equipos
                            </Link>

                            <Link
                                className="nav-link"
                                to="/admin/partidos"
                            >
                                Partidos Admin
                            </Link>

                            <Link
                                className="nav-link"
                                to="/admin/usuarios"
                            >
                                Usuarios
                            </Link>
                        </>
                    )}

                    <Link
                        className="nav-link"
                        to="/pronosticos"
                    >
                        Pronósticos
                    </Link>

                </div>

                <button
                    className="btn btn-danger"
                    onClick={cerrarSesion}
                >
                    Salir
                </button>

            </div>

        </nav>
    );
}

export default Navbar;