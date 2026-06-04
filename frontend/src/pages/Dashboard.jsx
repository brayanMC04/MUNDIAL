import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { obtenerRanking } from "../services/rankingService";
import { obtenerPartidos } from "../services/partidoService";

function Dashboard() {

    const [ranking, setRanking] = useState([]);
    const [partidosAbiertos, setPartidosAbiertos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const usuario = JSON.parse(localStorage.getItem("usuario")) || {};

    useEffect(() => {
        cargarContenido();
    }, []);

    const cargarContenido = async () => {
        try {
            const [rankingData, partidosData] = await Promise.all([
                obtenerRanking(),
                obtenerPartidos()
            ]);

            setRanking(rankingData || []);

            const abiertos = (partidosData || []).filter((partido) => {
                return (
                    partido.estado === "pendiente" &&
                    new Date(partido.fecha_cierre) > new Date()
                );
            });

            setPartidosAbiertos(abiertos);
        } catch (error) {
            console.error(error);
            setError("No se pudo cargar la información del dashboard.");
        } finally {
            setLoading(false);
        }
    };

    const usuarioRanking = ranking.find((item) => item.id === usuario.id) || {};
    const posicion = ranking.findIndex((item) => item.id === usuario.id) + 1;

    return (
        <>
            <Navbar />

            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1>Dashboard</h1>
                        <p className="text-muted">
                            Bienvenido{usuario.nombre ? `, ${usuario.nombre}` : ""}.
                        </p>
                    </div>
                    <Link className="btn btn-primary" to="/ranking">
                        Ver ranking completo
                    </Link>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h6 className="text-uppercase text-muted">Mi posición</h6>
                                <h2>{posicion > 0 ? posicion : "—"}</h2>
                                <p className="mb-0 text-muted">en el ranking general</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h6 className="text-uppercase text-muted">Mis puntos</h6>
                                <h2>{usuarioRanking.puntos ?? 0}</h2>
                                <p className="mb-0 text-muted">pronósticos + campeón</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h6 className="text-uppercase text-muted">Partidos abiertos</h6>
                                <h2>{partidosAbiertos.length}</h2>
                                <p className="mb-0 text-muted">puedes editar pronósticos</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h6 className="text-uppercase text-muted">Rol</h6>
                                <h2>{usuario.rol || "Usuario"}</h2>
                                <p className="mb-0 text-muted">acceso actual</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h4 className="card-title">Próximos partidos</h4>
                                {loading ? (
                                    <p>Cargando partidos...</p>
                                ) : partidosAbiertos.length === 0 ? (
                                    <p>No hay partidos abiertos en este momento.</p>
                                ) : (
                                    <div className="list-group">
                                        {partidosAbiertos.slice(0, 5).map((partido) => (
                                            <div
                                                key={partido.id}
                                                className="list-group-item d-flex justify-content-between align-items-start"
                                            >
                                                <div>
                                                    <div className="fw-bold">
                                                        {partido.equipo_local} vs {partido.equipo_visitante}
                                                    </div>
                                                    <small className="text-muted">
                                                        {new Date(partido.fecha_partido).toLocaleString()}
                                                    </small>
                                                </div>
                                                <span className="badge bg-success rounded-pill">
                                                    Abierto
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h4 className="card-title">Ranking top 5</h4>
                                {loading ? (
                                    <p>Cargando ranking...</p>
                                ) : ranking.length === 0 ? (
                                    <p>No hay datos de ranking disponibles.</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-sm mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Usuario</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ranking.slice(0, 5).map((item, index) => (
                                                    <tr key={item.id} className={item.id === usuario.id ? "table-primary" : ""}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.nombre}</td>
                                                        <td>{item.puntos}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
