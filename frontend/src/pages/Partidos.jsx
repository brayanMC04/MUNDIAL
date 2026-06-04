import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPartidos } from "../services/partidoService";

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
                <h2>Partidos</h2>

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
                                        <h5 className="card-title">
                                            {partido.equipo_local} vs {partido.equipo_visitante}
                                        </h5>
                                        <p className="card-text mb-1">
                                            <strong>Fase:</strong> {partido.fase}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Fecha:</strong> {new Date(partido.fecha_partido).toLocaleString()}
                                        </p>
                                        <p className="card-text">
                                            <strong>Estado:</strong> {partido.estado}
                                        </p>
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