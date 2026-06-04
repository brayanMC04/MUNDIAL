import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPronosticosUsuario } from "../services/pronosticoService";
import "../styles/perfil.css";

function Perfil() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    const [pronosticos, setPronosticos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const totalPronosticos = pronosticos.length;

    const puntosTotales = pronosticos.reduce(
        (acc, item) => acc + (item.puntos || 0),
        0
    );

    const acertados = pronosticos.filter(
        (item) => item.puntos > 0
    ).length;

    const porcentaje =
        totalPronosticos > 0
            ? Math.round(
                (acertados / totalPronosticos) * 100
            )
            : 0;

    useEffect(() => {
        cargarPronosticos();
    }, []);

    const cargarPronosticos = async () => {
        try {
            const response = await obtenerPronosticosUsuario(usuario.id);

            if (response.success) {
                setPronosticos(response.pronosticos);
            } else {
                setError(response.message || "No se pudo cargar el historial.");
            }
        } catch (err) {
            console.error(err);
            setError("Error al cargar el historial de pronósticos.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Mi Perfil</h2>

                <div className="perfil-header">

                    <div className="perfil-avatar">
                        👤
                    </div>

                    <div>

                        <h2 className="perfil-nombre">
                            {usuario?.nombre}
                        </h2>

                        <p className="perfil-subtitulo">
                            Pronosticador Mundialista
                        </p>

                        <div className="perfil-badges">

                            <span className="badge bg-warning text-dark">
                                🏆 {usuario?.rol}
                            </span>

                            <span className="badge bg-info">
                                🎯 {totalPronosticos} Pronósticos
                            </span>

                        </div>

                    </div>

                </div>

                <div className="row mb-4">

                    <div className="col-md-3">

                        <div className="stat-card">
                            <h3>{totalPronosticos}</h3>
                            <p>Pronósticos</p>
                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="stat-card">
                            <h3>{puntosTotales}</h3>
                            <p>Puntos</p>
                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="stat-card">
                            <h3>{acertados}</h3>
                            <p>Aciertos</p>
                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="stat-card">
                            <h3>{porcentaje}%</h3>
                            <p>Efectividad</p>
                        </div>

                    </div>

                </div>

                <h3 className="historial-title">📜 Historial Mundialista</h3>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {cargando ? (
                    <div className="alert alert-info" role="alert">
                        Cargando historial...
                    </div>
                ) : pronosticos.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                        No tienes pronósticos registrados.
                    </div>
                ) : (
                    pronosticos.map((pronostico) => (
                        <div key={pronostico.id} className="card mb-3">
                            <div className="card-body">
                                <h5>
                                    {pronostico.equipo_local}
                                    {" vs "}
                                    {pronostico.equipo_visitante}
                                </h5>

                                <p>
                                    <strong>Fecha partido:</strong>{" "}
                                    {new Date(pronostico.fecha_partido).toLocaleString()}
                                </p>

                                <p>
                                    <strong>Mi pronóstico:</strong>{" "}
                                    {pronostico.pred_local} - {pronostico.pred_visitante}
                                </p>

                                <p>
                                    <strong>Puntos:</strong>{" "}
                                    {pronostico.puntos}
                                </p>

                                <p>
                                    <strong>Calificado:</strong>{" "}
                                    {pronostico.calificado ? "Sí" : "No"}
                                </p>

                                <p>
                                    <strong>Estado partido:</strong>{" "}
                                    {pronostico.estado}
                                </p>

                                {pronostico.estado === "finalizado" && (
                                    <p>
                                        <strong>Resultado oficial:</strong>{" "}
                                        {pronostico.goles_local} - {pronostico.goles_visitante}
                                    </p>
                                )}

                                <p>
                                    <strong>Fecha de pronóstico:</strong>{" "}
                                    {new Date(pronostico.fecha_pronostico).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default Perfil;