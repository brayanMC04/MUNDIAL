import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerEquipos } from "../services/equipoService";
import { obtenerPartidos } from "../services/partidoService";
import { guardarCampeon, obtenerCampeonUsuario } from "../services/campeonService";
import "../styles/campeon.css";

function Campeon() {

    const [equipos, setEquipos] = useState([]);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
    const [campeonActual, setCampeonActual] = useState(null);
    const [torneoIniciado, setTorneoIniciado] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuarioId = usuario?.id;

    useEffect(() => {
        cargarEquipos();
        cargarCampeon();
        cargarEstadoTorneo();
    }, []);

    const cargarEquipos = async () => {
        try {
            const data = await obtenerEquipos();
            setEquipos(data);
        } catch (error) {
            console.error("Error cargando equipos:", error);
            setError("No se pudieron cargar los equipos.");
        }
    };

    const cargarEstadoTorneo = async () => {
        try {
            const partidos = await obtenerPartidos();
            const fechas = (partidos || [])
                .map((partido) => new Date(partido.fecha_partido))
                .filter((fecha) => !Number.isNaN(fecha.getTime()));
            const inicio = fechas.length ? new Date(Math.min(...fechas)) : null;
            setTorneoIniciado(inicio ? inicio <= new Date() : false);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarCampeon = async () => {
        if (!usuarioId) {
            return;
        }

        try {
            const data = await obtenerCampeonUsuario(usuarioId);
            setCampeonActual(data);
        } catch (error) {
            console.error(error);
        }
    };

    const guardar = async () => {
        setMensaje("");
        setError("");

        if (torneoIniciado) {
            setError("El mundial ya comenzó. No puedes cambiar tu campeón.");
            return;
        }

        if (!equipoSeleccionado) {
            setError("Selecciona un equipo antes de guardar.");
            return;
        }

        try {
            await guardarCampeon({
                usuario_id: usuarioId,
                equipo_id: equipoSeleccionado
            });

            const equipo = equipos.find((item) => Number(item.id) === Number(equipoSeleccionado));
            setCampeonActual(equipo || null);
            setMensaje("Campeón guardado correctamente.");
        } catch (error) {
            console.error(error);
            setError("Error guardando campeón. Intenta de nuevo.");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                    <div>
                        <h2>Elegir Campeón del Mundo</h2>
                        <p className="text-muted mb-0">
                            Selecciona el equipo al que apuestas como campeón. Puedes cambiarlo hasta que comience el mundial.
                        </p>
                    </div>
                    <div>
                        <span className={`badge ${torneoIniciado ? "bg-danger" : "bg-warning text-dark"}`}>
                            {torneoIniciado ? "Mundial iniciado" : campeonActual ? "Campeón actual" : "Sin campeón"}
                        </span>
                    </div>
                </div>

                {campeonActual && (
                    <div className="alert alert-info">
                        Tu selección actual es <strong>{campeonActual.nombre}</strong>.
                    </div>
                )}

                <div className="card">
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="equipo-campeon" className="form-label">
                                Equipo campeón
                            </label>
                            <div className="equipos-grid">
                                
                                {equipos.map((equipo) => (

                                    <div
                                        key={equipo.id}
                                        className={`equipo-card ${
                                            Number(equipoSeleccionado) === Number(equipo.id)
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            !torneoIniciado &&
                                            setEquipoSeleccionado(equipo.id)
                                        }
                                    >

                                        <div className="equipo-bandera">
                                            🏆
                                        </div>

                                        <h5>
                                            {equipo.nombre}
                                        </h5>

                                        {
                                            Number(equipoSeleccionado) === Number(equipo.id) &&
                                            (
                                                <span className="seleccionado">
                                                    ✓ Seleccionado
                                                </span>
                                            )
                                        }

                                    </div>

                                ))}

                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={guardar}
                            disabled={!equipoSeleccionado || torneoIniciado}
                        >
                            {torneoIniciado ? "No disponible" : campeonActual ? "Actualizar campeón" : "Guardar campeón"}
                        </button>

                        {torneoIniciado && (
                            <div className="alert alert-warning mt-3">
                                El mundial ya comenzó. Ya no puedes cambiar la selección de campeón.
                            </div>
                        )}

                        {mensaje && (
                            <div className="alert alert-success mt-3">
                                {mensaje}
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger mt-3">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

export default Campeon;