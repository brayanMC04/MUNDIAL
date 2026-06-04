import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPartidos } from "../services/partidoService";
import "../styles/partidos.css";

function Partidos() {
    const [partidos, setPartidos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarPartidos();
    }, []);

    const cargarPartidos = async () => {
        try {
            const data = await obtenerPartidos();
            setPartidos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">
                <div className="partidos-header">

                    <h1 className="partidos-title">
                        ⚽ Mundial 2026
                    </h1>

                    <p className="partidos-subtitle">
                        Calendario oficial de partidos
                    </p>

                </div>

                {cargando ? (
                    <p>Cargando partidos...</p>
                ) : partidos.length === 0 ? (
                    <p>No hay partidos disponibles.</p>
                ) : (
                    <div className="row">
                        {partidos.map((partido) => (
                            <div className="col-md-6" key={partido.id}>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="partido-equipos">

                                            <div className="equipo">
                                                {partido.equipo_local}
                                            </div>

                                            <div className="vs">
                                                VS
                                            </div>

                                            <div className="equipo">
                                                {partido.equipo_visitante}
                                            </div>

                                        </div>
                                        <p className="card-text mb-1">
                                            <strong>Fase:</strong> {partido.fase}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Fecha:</strong> {new Date(partido.fecha_partido).toLocaleString()}
                                        </p>
                                        <div className={`estado-badge estado-${partido.estado}`}>
                                            {partido.estado}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Partidos;