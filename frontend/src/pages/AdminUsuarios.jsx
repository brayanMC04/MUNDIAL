import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { crearUsuario, obtenerUsuarios } from "../services/usuarioService";

function AdminUsuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({
        cedula: "",
        nombre: "",
        password: "",
        rol: "usuario"
    });
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const response = await obtenerUsuarios();

            if (response.success) {
                setUsuarios(response.usuarios);
            } else {
                setError(response.message || "No se pudieron cargar los usuarios.");
            }
        } catch (err) {
            console.error(err);
            setError("Error al cargar usuarios.");
        }
    };

    const manejarCambio = (campo, valor) => {
        setForm({
            ...form,
            [campo]: valor
        });
    };

    const guardarUsuario = async () => {
        try {
            if (!form.cedula || !form.nombre || !form.password) {
                setError("Complete todos los campos del formulario.");
                setMensaje("");
                return;
            }

            const response = await crearUsuario(form);

            if (response.success) {
                setMensaje(response.message || "Usuario creado correctamente.");
                setError("");
                setForm({
                    cedula: "",
                    nombre: "",
                    password: "",
                    rol: "usuario"
                });
                cargarUsuarios();
            } else {
                setError(response.message || "No se pudo crear el usuario.");
                setMensaje("");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al crear usuario.");
            setMensaje("");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Administración de Usuarios</h2>

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
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Cédula"
                                    value={form.cedula}
                                    onChange={(e) => manejarCambio("cedula", e.target.value)}
                                />
                            </div>

                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre"
                                    value={form.nombre}
                                    onChange={(e) => manejarCambio("nombre", e.target.value)}
                                />
                            </div>

                            <div className="col-md-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Contraseña"
                                    value={form.password}
                                    onChange={(e) => manejarCambio("password", e.target.value)}
                                />
                            </div>

                            <div className="col-md-2">
                                <select
                                    className="form-select"
                                    value={form.rol}
                                    onChange={(e) => manejarCambio("rol", e.target.value)}
                                >
                                    <option value="usuario">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <div className="col-md-1">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={guardarUsuario}
                                >
                                    Crear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Creado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.cedula}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.rol}</td>
                                <td>{new Date(usuario.fecha_creacion).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AdminUsuarios;
