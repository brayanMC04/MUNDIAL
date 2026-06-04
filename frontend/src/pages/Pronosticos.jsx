import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPartidos } from "../services/partidoService";
import { guardarPronostico } from "../services/pronosticoService";

function Pronosticos() {

    const [partidos, setPartidos] = useState([]);

    useEffect(() => {
        cargarPartidos();
    }, []);

    const cargarPartidos = async () => {

        try {

            const data = await obtenerPartidos();

            setPartidos(data);

        } catch (error) {

            console.error(error);
        }
    };

    const guardar = async (partido) => {

        try {

            const usuario = JSON.parse(
                localStorage.getItem("usuario")
            );

            await guardarPronostico({
                usuario_id: usuario.id,
                partido_id: partido.id,
                pred_local: partido.pred_local || 0,
                pred_visitante: partido.pred_visitante || 0
            });

            alert("Pronóstico guardado");

        } catch (error) {

            console.error(error);

            alert("Error guardando pronóstico");
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

                {
                    partidos.map((partido) => (

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

                                <div className="row">

                                    <div className="col-3">

                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
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
                                            onClick={() =>
                                                guardar(partido)
                                            }
                                        >
                                            Guardar
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))
                }

            </div>
        </>
    );
}

export default Pronosticos;