import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerEquipos } from "../services/equipoService";

function AdminEquipos() {

    const [equipos, setEquipos] = useState([]);

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

    return (
        <>
            <Navbar />

            <div className="container mt-4">
                <h2>Administración de Equipos</h2>

                <button className="btn btn-primary mb-3">
                    Nuevo Equipo
                </button>

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