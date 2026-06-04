import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerEquipos, crearEquipo } from "../services/equipoService";

function AdminEquipos() {

    const [equipos, setEquipos] = useState([]);
    const [nuevoEquipo, setNuevoEquipo] = useState({
        nombre: "",
        codigo_fifa: "",
        bandera_url: ""
    });
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        cargarEquipos();
    }, []);

    const cargarEquipos = async () => {

        try {

            const data = await obtenerEquipos();

            setEquipos(data);

        } catch (error) {

            console.error(error);
            setError("Error al cargar equipos.");

        }
    };

    const manejarCambioEquipo = (campo, valor) => {
        setNuevoEquipo({
            ...nuevoEquipo,
            [campo]: valor
        });
    };

    const crearNuevoEquipo = async () => {
        try {
            if (!nuevoEquipo.nombre || !nuevoEquipo.codigo_fifa) {
                setError("Nombre y código FIFA son obligatorios.");
                setMensaje("");
                return;
            }

            const response = await crearEquipo(nuevoEquipo);

            if (response.success) {
                setMensaje(response.message || "Equipo creado correctamente.");
                setError("");
                setNuevoEquipo({
                    nombre: "",
                    codigo_fifa: "",
                    bandera_url: ""
                });
                cargarEquipos();
            } else {
                setError(response.message || "No se pudo crear el equipo.");
                setMensaje("");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al crear equipo.");
            setMensaje("");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">
                <h2>Administración de Equipos</h2>

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

                <div className="card mb-4">
                    <div className="card-body row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nuevoEquipo.nombre}
                                onChange={(e) => manejarCambioEquipo("nombre", e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Código FIFA</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nuevoEquipo.codigo_fifa}
                                onChange={(e) => manejarCambioEquipo("codigo_fifa", e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">URL Bandera (opcional)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nuevoEquipo.bandera_url}
                                onChange={(e) => manejarCambioEquipo("bandera_url", e.target.value)}
                            />
                        </div>
                        <div className="col-md-1">
                            <button
                                className="btn btn-primary w-100"
                                onClick={crearNuevoEquipo}
                            >
                                Crear
                            </button>
                        </div>
                    </div>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Código FIFA</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>

                        {equipos.map((equipo) => (

                            <tr key={equipo.id}>

                                <td>{equipo.id}</td>

                                <td>{equipo.nombre}</td>

                                <td>{equipo.codigo_fifa}</td>

                                <td>

                                    <button className="btn btn-warning btn-sm me-2">
                                        Editar
                                    </button>

                                    <button className="btn btn-danger btn-sm">
                                        Eliminar
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
        </>
    );
}

export default AdminEquipos;