import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPartidos } from "../services/partidoService";
import { guardarPronostico } from "../services/pronosticoService";

function Pronosticos() {

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

                <h2>Mis Pronósticos</h2>

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
                                className="card mb-3"
                            >

                                <div className="card-body">

                                    <h5>
                                        {partido.equipo_local}
                                        {" vs "}
                                        {partido.equipo_visitante}
                                    </h5>

                                    <p>
                                        {new Date(
                                            partido.fecha_partido
                                        ).toLocaleString()}
                                    </p>

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

                                    <div className="row">

                                        <div className="col-3">

                                            <input
                                                type="number"
                                                className="form-control"
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

                                        <div className="col-3">

                                            <input
                                                type="number"
                                                className="form-control"
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

                                        <div className="col-3">

                                            <button
                                                className="btn btn-success"
                                                disabled={partidoCerrado}
                                                onClick={() =>
                                                    guardar(partido)
                                                }
                                            >
                                                Guardar
                                            </button>

                                        </div>

                                        {partidoCerrado && (
                                            <div className="col-3 mt-2">
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