import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    obtenerPartidos,
    crearPartido,
    actualizarResultadoPartido,
    eliminarPartidoBackend
} from "../services/partidoService";
import { obtenerEquipos } from "../services/equipoService";

function AdminPartidos() {
    const [equipos, setEquipos] = useState([]);
    const [partidos, setPartidos] = useState([]);
    const [resultados, setResultados] = useState({});
    const [partidosEnEdicion, setPartidosEnEdicion] = useState({}); 
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [nuevoPartido, setNuevoPartido] = useState({
        fase: "Fase de grupos",
        equipo_local_id: "",
        equipo_visitante_id: "",
        fecha_partido: "",
        fecha_cierre: ""
    });

    useEffect(() => {
        cargarEquipos();
        cargarPartidos();
    }, []);

    const cargarEquipos = async () => {
        try {
            const data = await obtenerEquipos();
            setEquipos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarPartidos = async () => {
        try {
            const data = await obtenerPartidos();
            setPartidos(data);
        } catch (error) {
            console.error(error);
        }
    };

    const actualizarResultado = (id, campo, valor) => {
        setResultados({
            ...resultados,
            [id]: {
                ...resultados[id],
                [campo]: valor
            }
        });
    };

    const finalizarPartido = async (partido) => {
        try {
            const estaEditando = partidosEnEdicion[partido.id];
            
            // Si el admin editó valores, los tomamos; si no, dejamos los que ya venían del partido.
            // 🔥 Agregamos por defecto que si le da a "Cerrar partido" el estado pase a "finalizado",
            // y si está editando y selecciona otra cosa del select, se respete.
            const resultado = resultados[partido.id] || {
                goles_local: partido.goles_local ?? 0,
                goles_visitante: partido.goles_visitante ?? 0,
                estado: estaEditando ? partido.estado : "finalizado"
            };

            // Aseguramos que si no cambió el select del estado explícitamente en la edición, use un valor coherente
            const nuevoEstado = resultado.estado || (estaEditando ? "pendiente" : "finalizado");

            await actualizarResultadoPartido(partido.id, {
                goles_local: Number(resultado.goles_local),
                goles_visitante: Number(resultado.goles_visitante),
                estado: nuevoEstado // 🔥 Enviamos el nuevo estado dinámico al backend
            });

            alert("Partido actualizado correctamente.");
            
            setPartidosEnEdicion({
                ...partidosEnEdicion,
                [partido.id]: false
            });

            cargarPartidos();
        } catch (error) {
            console.error(error);
            alert("Error al guardar el resultado del partido.");
        }
    };

    const manejarEliminarPartido = async (partidoId) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el partido con ID ${partidoId}? Esta acción no se puede deshacer.`);
        if (!confirmar) return;

        try {
            await eliminarPartidoBackend(partidoId);
            alert("Partido eliminado correctamente.");
            cargarPartidos();
        } catch (error) {
            console.error(error);
            alert("Error al intentar eliminar el partido. Asegúrate de que el backend soporte la ruta DELETE.");
        }
    };

    const activarModoEdicion = (partidoId) => {
        setPartidosEnEdicion({
            ...partidosEnEdicion,
            [partidoId]: true
        });
    };

    const manejarCambioNuevoPartido = (campo, valor) => {
        setNuevoPartido({
            ...nuevoPartido,
            [campo]: valor
        });
    };

    const crearNuevoPartido = async () => {
        try {
            if (
                !nuevoPartido.equipo_local_id ||
                !nuevoPartido.equipo_visitante_id ||
                !nuevoPartido.fecha_partido ||
                !nuevoPartido.fecha_cierre
            ) {
                setFormError("Complete todos los campos del partido.");
                setFormSuccess("");
                return;
            }

            if (nuevoPartido.equipo_local_id === nuevoPartido.equipo_visitante_id) {
                setFormError("El equipo local y el visitante deben ser diferentes.");
                setFormSuccess("");
                return;
            }

            await crearPartido({
                fase: nuevoPartido.fase,
                equipo_local_id: Number(nuevoPartido.equipo_local_id),
                equipo_visitante_id: Number(nuevoPartido.equipo_visitante_id),
                fecha_partido: nuevoPartido.fecha_partido,
                fecha_cierre: nuevoPartido.fecha_cierre
            });

            setFormSuccess("Partido creado correctamente.");
            setFormError("");
            setNuevoPartido({
                fase: "Fase de grupos",
                equipo_local_id: "",
                equipo_visitante_id: "",
                fecha_partido: "",
                fecha_cierre: ""
            });
            cargarPartidos();
        } catch (error) {
            console.error(error);
            setFormError("Error al crear el partido.");
            setFormSuccess("");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">
                <h2>Administración de Partidos</h2>

                {/* Formulario de creación */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Crear nuevo partido</h5>
                        <div className="row g-3">
                            {(formError || formSuccess) && (
                                <div className="col-12">
                                    {formError && (
                                        <div className="alert alert-danger p-2" role="alert">
                                            {formError}
                                        </div>
                                    )}
                                    {formSuccess && (
                                        <div className="alert alert-success p-2" role="alert">
                                            {formSuccess}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="col-md-3">
                                <label className="form-label">Fase</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nuevoPartido.fase}
                                    onChange={(e) => manejarCambioNuevoPartido("fase", e.target.value)}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Equipo local</label>
                                <select
                                    className="form-select"
                                    value={nuevoPartido.equipo_local_id}
                                    onChange={(e) => manejarCambioNuevoPartido("equipo_local_id", e.target.value)}
                                >
                                    <option value="">Seleccione</option>
                                    {equipos.map((equipo) => (
                                        <option key={equipo.id} value={equipo.id}>
                                            {equipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Equipo visitante</label>
                                <select
                                    className="form-select"
                                    value={nuevoPartido.equipo_visitante_id}
                                    onChange={(e) => manejarCambioNuevoPartido("equipo_visitante_id", e.target.value)}
                                >
                                    <option value="">Seleccione</option>
                                    {equipos.map((equipo) => (
                                        <option key={equipo.id} value={equipo.id}>
                                            {equipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Fecha partido</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={nuevoPartido.fecha_partido}
                                    onChange={(e) => manejarCambioNuevoPartido("fecha_partido", e.target.value)}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Fecha cierre</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={nuevoPartido.fecha_cierre}
                                    onChange={(e) => manejarCambioNuevoPartido("fecha_cierre", e.target.value)}
                                />
                            </div>

                            <div className="col-md-3 align-self-end">
                                <button className="btn btn-success mt-2" onClick={crearNuevoPartido}>
                                    Crear partido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de partidos */}
                <table className="table table-bordered align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Local</th>
                            <th>Visitante</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Goles local</th>
                            <th>Goles visitante</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partidos.map((partido) => {
                            const esFinalizado = partido.estado === "finalizado";
                            const estaEditando = partidosEnEdicion[partido.id]; 
                            const inputsBloqueados = esFinalizado && !estaEditando;

                            const resultado = resultados[partido.id] || {
                                goles_local: partido.goles_local ?? "",
                                goles_visitante: partido.goles_visitante ?? "",
                                estado: partido.estado ?? "pendiente" // 🔥 Mantenemos el estado actual
                            };

                            return (
                                <tr key={partido.id}>
                                    <td>{partido.id}</td>
                                    <td>{partido.equipo_local}</td>
                                    <td>{partido.equipo_visitante}</td>
                                    <td>{partido.fecha_partido}</td>
                                    
                                    {/* 🔥 ESTADO INTERACTIVO: Si está editando, deja cambiar el estado */}
                                    <td>
                                        {!inputsBloqueados ? (
                                            <select
                                                className="form-select form-select-sm"
                                                value={resultado.estado}
                                                onChange={(e) => actualizarResultado(partido.id, "estado", e.target.value)}
                                            >
                                                <option value="pendiente">pendiente</option>
                                                <option value="finalizado">finalizado</option>
                                            </select>
                                        ) : (
                                            <span className={`badge ${esFinalizado ? "bg-secondary" : "bg-success"}`}>
                                                {partido.estado}
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={resultado.goles_local}
                                            disabled={inputsBloqueados}
                                            onChange={(e) => actualizarResultado(partido.id, "goles_local", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={resultado.goles_visitante}
                                            disabled={inputsBloqueados}
                                            onChange={(e) => actualizarResultado(partido.id, "goles_visitante", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {inputsBloqueados ? (
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => activarModoEdicion(partido.id)}
                                                >
                                                    Corregir
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => finalizarPartido(partido)}
                                                >
                                                    {estaEditando ? "Guardar Corrección" : "Cerrar partido"}
                                                </button>
                                            )}

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => manejarEliminarPartido(partido.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AdminPartidos;