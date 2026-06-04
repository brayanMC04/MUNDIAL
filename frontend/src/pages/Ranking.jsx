import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerRanking } from "../services/rankingService";

function Ranking() {

    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        cargarRanking();
    }, []);

    const cargarRanking = async () => {

        try {

            const data = await obtenerRanking();

            setRanking(data);

        } catch (error) {

            console.error(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>Ranking General</h2>

                <table className="table table-striped">

                    <thead>

                        <tr>
                            <th>#</th>
                            <th>Usuario</th>
                            <th>Puntos</th>
                        </tr>

                    </thead>

                    <tbody>

                        {ranking.map((usuario, index) => (

                            <tr key={index}>

                                <td>{index + 1}</td>

                                <td>
                                    {usuario.nombre}
                                </td>

                                <td>
                                    {usuario.puntos}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
        </>
    );
}

export default Ranking;