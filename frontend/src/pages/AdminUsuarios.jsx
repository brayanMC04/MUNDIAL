import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// 🔄 Importamos las dos nuevas funciones de tu servicio
import { crearUsuario, obtenerUsuarios, actualizarUsuario, borrarUsuario } from "../services/usuarioService";

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
    
    // 🆕 Estado para controlar si estamos editando (Guarda el ID del usuario, o null si es creación)
    const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);

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

    // 🆕 LÓGICA COMPARTIDA: CREAR O EDITAR USUARIO
    const guardarUsuario = async () => {
        try {
            // Si estamos creando, la contraseña es obligatoria. 
            // Si editamos, podemos dejarla opcional dependiendo de tu backend (aquí la validamos si es creación).
            if (!form.cedula || !form.nombre || (!usuarioEditandoId && !form.password)) {
                setError("Complete todos los campos del formulario.");
                setMensaje("");
                return;
            }

            let response;

            if (usuarioEditandoId) {
                // 📝 MODO EDICIÓN (PUT)
                response = await actualizarUsuario(usuarioEditandoId, form);
            } else {
                // ➕ MODO CREACIÓN (POST)
                response = await crearUsuario(form);
            }

            if (response.success) {
                setMensaje(response.message || (usuarioEditandoId ? "Usuario actualizado correctamente." : "Usuario creado correctamente."));
                setError("");
                
                // Limpiamos el formulario y los estados de edición
                cancelarEdicion();
                cargarUsuarios();
            } else {
                setError(response.message || "No se pudo procesar la solicitud.");
                setMensaje("");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al procesar el usuario.");
            setMensaje("");
        }
    };

    // 🆕 LÓGICA PARA CARGAR DATOS EN EL FORMULARIO
    const iniciarEdicion = (usuario) => {
        setUsuarioEditandoId(usuario.id);
        setForm({
            cedula: usuario.cedula,
            nombre: usuario.nombre,
            password: "", // Dejamos la contraseña en blanco por seguridad si el administrador no la va a cambiar
            rol: usuario.rol
        });
        setMensaje("");
        setError("");
    };

    // 🆕 LÓGICA PARA CANCELAR LA EDICIÓN Y VOLVER A MODO CREACIÓN
    const cancelarEdicion = () => {
        setUsuarioEditandoId(null);
        setForm({
            cedula: "",
            nombre: "",
            password: "",
            rol: "usuario"
        });
    };

    // 🆕 LÓGICA PARA ELIMINAR EL USUARIO
    const eliminarUsuarioClick = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}"?\nEsta acción es definitiva y borrará todos sus pronósticos.`)) {
            try {
                const response = await borrarUsuario(id);
                if (response.success) {
                    setMensaje(response.message || "Usuario eliminado correctamente.");
                    setError("");
                    // Si eliminamos al usuario que teníamos en pantalla editando, limpiamos el formulario
                    if (usuarioEditandoId === id) cancelarEdicion();
                    cargarUsuarios();
                } else {
                    setError(response.message || "No se pudo eliminar el usuario.");
                    setMensaje("");
                }
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Error al eliminar usuario.");
                setMensaje("");
            }
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

                {/* TÍTULO DINÁMICO DE LA TARJETA */}
                <div className={`card mb-4 ${usuarioEditandoId ? "border-warning" : ""}`}>
                    <div className="card-header">
                        <strong>{usuarioEditandoId ? "✏️ Editar Usuario" : "➕ Crear Nuevo Usuario"}</strong>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-2">
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
                                    placeholder={usuarioEditandoId ? "Nueva Contraseña (Opcional)" : "Contraseña"}
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

                            {/* BOTONES ACCIÓN DINÁMICOS */}
                            <div className="col-md-2 d-flex gap-2">
                                <button
                                    className={`btn ${usuarioEditandoId ? "btn-warning" : "btn-primary"} w-100`}
                                    onClick={guardarUsuario}
                                >
                                    {usuarioEditandoId ? "Actualizar" : "Crear"}
                                </button>
                                {usuarioEditandoId && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={cancelarEdicion}
                                    >
                                        ❌
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <table className="table table-bordered table-striped align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Creado</th>
                            <th className="text-center" style={{ width: "180px" }}>Acciones</th> {/* 🆕 Columna nueva */}
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id} className={usuarioEditandoId === usuario.id ? "table-warning" : ""}>
                                <td>{usuario.id}</td>
                                <td>{usuario.cedula}</td>
                                <td>{usuario.nombre}</td>
                                <td>
                                    <span className={`badge ${usuario.rol === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                        {usuario.rol}
                                    </span>
                                </td>
                                <td>{usuario.fecha_creacion ? new Date(usuario.fecha_creacion).toLocaleString() : "N/A"}</td>
                                {/* 🆕 BOTONES DE EDICIÓN Y BORRADO DIRECTO EN LA FILA */}
                                <td className="text-center">
                                    <div className="d-flex justify-content-center gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={() => iniciarEdicion(usuario)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => eliminarUsuarioClick(usuario.id, usuario.nombre)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AdminUsuarios;