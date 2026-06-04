import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerEquipos } from "../services/equipoService";
import { guardarCampeon } from "../services/campeonService";

function Campeon() {

    const [equipos, setEquipos] = useState([]);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState("");

    useEffect(() => {
        cargarEquipos();
    }, []);

    const cargarEquipos = async () => {

        try {

            const data = await obtenerEquipos();

            setEquipos(data);

        } catch (error) {

            console.error(error);
        }
    };

    const guardar = async () => {

        try {

            const usuario = JSON.parse(
                localStorage.getItem("usuario")
            );

            await guardarCampeon({
                usuario_id: usuario.id,
                equipo_id: equipoSeleccionado
            });

            alert("Campeón guardado correctamente");

        } catch (error) {

            console.error(error);

            alert("Error guardando campeón");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Elegir Campeón del Mundo</h2>

                <div className="card">

                    <div className="card-body">

                        <select
                            className="form-select mb-3"
                            value={equipoSeleccionado}
                            onChange={(e) =>
                                setEquipoSeleccionado(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Seleccione un equipo
                            </option>

                            {
                                equipos.map((equipo) => (

                                    <option
                                        key={equipo.id}
                                        value={equipo.id}
                                    >
                                        {equipo.nombre}
                                    </option>

                                ))
                            }

                        </select>

                        <button
                            className="btn btn-primary"
                            onClick={guardar}
                        >
                            Guardar Campeón
                        </button>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Campeon;