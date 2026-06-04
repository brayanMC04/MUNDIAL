import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPartidos } from "../services/partidoService";

function AdminPartidos() {

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

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Administración de Partidos</h2>

                <table className="table table-bordered">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Local</th>
                            <th>Visitante</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            partidos.map((partido) => (

                                <tr key={partido.id}>

                                    <td>{partido.id}</td>

                                    <td>{partido.equipo_local}</td>

                                    <td>{partido.equipo_visitante}</td>

                                    <td>{partido.fecha_partido}</td>

                                    <td>{partido.estado}</td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>
        </>
    );
}

export default AdminPartidos;