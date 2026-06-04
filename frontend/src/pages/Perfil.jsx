import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPronosticosUsuario } from "../services/pronosticoService";

function Perfil() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    const [pronosticos, setPronosticos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

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

                <div className="card mb-4">
                    <div className="card-body">
                        <p>
                            <strong>Nombre:</strong>{" "}
                            {usuario?.nombre}
                        </p>

                        <p>
                            <strong>Cédula:</strong>{" "}
                            {usuario?.cedula}
                        </p>

                        <p>
                            <strong>Rol:</strong>{" "}
                            {usuario?.rol}
                        </p>
                    </div>
                </div>

                <h3>Historial de pronósticos</h3>

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