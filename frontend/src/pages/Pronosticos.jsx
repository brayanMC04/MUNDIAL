import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPartidos } from "../services/partidoService";
import { guardarPronostico } from "../services/pronosticoService";
import "../styles/pronosticos.css";

function Pronosticos() {

    const calcularTiempoRestante = (fechaCierre) => {

        const diferencia =
            new Date(fechaCierre) - new Date();

        if (diferencia <= 0)
            return "Cerrado";

        const dias =
            Math.floor(
                diferencia /
                (1000 * 60 * 60 * 24)
            );

        const horas =
            Math.floor(
                (diferencia %
                    (1000 * 60 * 60 * 24))
                /
                (1000 * 60 * 60)
            );

        return `${dias}d ${horas}h`;
    };

    const [partidos, setPartidos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        cargarPartidos();
    }, []);

    const cargarPartidos = async () => {

        try {

            const data = await obtenerPartidos();
            const abiertos = data.filter((partido) => {
                const cerrado =
                    partido.estado !== "pendiente" ||
                    new Date(partido.fecha_cierre) <= new Date();

                return !cerrado;
            });

            setPartidos(abiertos);

        } catch (error) {

            console.error(error);
        }
    };

    const guardar = async (partido) => {

        try {
            const partidoCerrado =
                partido.estado !== "pendiente" ||
                new Date(partido.fecha_cierre) <= new Date();

            if (partidoCerrado) {
                setError("El partido ya cerró. No se puede guardar el pronóstico.");
                setMensaje("");
                return;
            }

            const usuario = JSON.parse(
                localStorage.getItem("usuario")
            );

            const response = await guardarPronostico({
                usuario_id: usuario.id,
                partido_id: partido.id,
                pred_local: partido.pred_local || 0,
                pred_visitante: partido.pred_visitante || 0
            });

            setMensaje(response.message || "Pronóstico guardado");
            setError("");

        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Error guardando pronóstico"
            );
            setMensaje("");
        }
    };

    const actualizarMarcador = (
        id,
        campo,
        valor
    ) => {

        const nuevosPartidos = partidos.map((p) => {

            if (p.id === id) {

                return {
                    ...p,
                    [campo]: valor
                };
            }

            return p;
        });

        setPartidos(nuevosPartidos);
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <div className="pronosticos-header">

                    <h1 className="pronosticos-title">🎯 Mis Pronósticos</h1>

                    <p className="pronosticos-subtitle">
                        Predice los resultados y sube en el ranking mundialista
                    </p>

                </div>

                {mensaje && (
                    <div className="alert alert-success" role="alert">
                        {mensaje}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {partidos.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                        No hay partidos abiertos para pronosticar.
                    </div>
                ) : (
                    partidos.map((partido) => {
                        const partidoCerrado =
                            partido.estado !== "pendiente" ||
                            new Date(partido.fecha_cierre) <= new Date();

                        return (
                            <div
                                key={partido.id}
                                className="card mb-4 partido-card"
                            >

                                <div className="card-body">

                                    <div className="partido-header">

                                        <h3>
                                            {partido.equipo_local}
                                            <span className="vs-text">
                                                VS
                                            </span>
                                            {partido.equipo_visitante}
                                        </h3>

                                    </div>

                                    <div className="partido-info">

                                        📅 {
                                            new Date(
                                                partido.fecha_partido
                                            ).toLocaleString()
                                        }

                                    </div>

                                    <div className="partido-tiempo">

                                        ⏳ Cierra en:

                                        <span>
                                            {
                                                calcularTiempoRestante(
                                                    partido.fecha_cierre
                                                )
                                            }
                                        </span>

                                    </div>

                                    <p>
                                        <strong>Estado:</strong>{" "}
                                        {partido.estado}
                                    </p>

                                    {partido.estado === "finalizado" && (
                                        <p>
                                            <strong>Resultado oficial:</strong>{" "}
                                            {partido.goles_local}
                                            {" - "}
                                            {partido.goles_visitante}
                                        </p>
                                    )}

                                    <div className="row align-items-center text-center">

                                        <div className="col-md-5">

                                            <h5 className="equipo-nombre">
                                                {partido.equipo_local}
                                            </h5>

                                            <input
                                                type="number"
                                                className="form-control marcador-input"
                                                min="0"
                                                value={partido.pred_local || ""}
                                                disabled={partidoCerrado}
                                                onChange={(e) =>
                                                    actualizarMarcador(
                                                        partido.id,
                                                        "pred_local",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                        <div className="col-md-2">

                                            <div className="vs-icon">
                                                ⚔️
                                            </div>

                                        </div>

                                        <div className="col-md-5">

                                            <h5 className="equipo-nombre">
                                                {partido.equipo_visitante}
                                            </h5>

                                            <input
                                                type="number"
                                                className="form-control marcador-input"
                                                min="0"
                                                value={partido.pred_visitante || ""}
                                                disabled={partidoCerrado}
                                                onChange={(e) =>
                                                    actualizarMarcador(
                                                        partido.id,
                                                        "pred_visitante",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>

                                    <div className="text-center mt-4">

                                        <button
                                            className="btn btn-primary btn-lg pronosticos-guardar"
                                            disabled={partidoCerrado}
                                            onClick={() => guardar(partido)}
                                        >
                                            🎯 Guardar Pronóstico
                                        </button>

                                        {partidoCerrado && (
                                            <div className="mt-3">
                                                <span className="badge bg-secondary">
                                                    Pronóstico cerrado
                                                </span>
                                            </div>
                                        )}

                                    </div>

                                </div>

                            </div>
                        );
                    })
                )}

            </div>
        </>
    );
}

export default Pronosticos;