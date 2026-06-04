import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerRanking } from "../services/rankingService";
import "../styles/ranking.css";

function Ranking() {

    const [ranking, setRanking] = useState([]);

    const usuario =
    JSON.parse(
        localStorage.getItem("usuario")
    ) || {};

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

    const top3 = ranking.slice(0, 3);

    const miPosicion =
        ranking.findIndex(
            item => item.id === usuario.id
        ) + 1;

    const misDatos =
        ranking.find(
            item => item.id === usuario.id
        );

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <div className="ranking-header">

                    <h1 className="ranking-title">
                        🏆 Ranking Mundialista
                    </h1>

                    <p className="ranking-subtitle">
                        Los mejores pronosticadores del torneo
                    </p>

                </div>

                <div className="card mb-4">

                    <div className="card-body text-center">

                        <h5>Mi Posición</h5>

                        <h1>
                            {miPosicion || "-"}
                        </h1>

                        <p>
                            {misDatos?.puntos || 0} puntos
                        </p>

                    </div>

                </div>

                {
                    top3.length >= 3 && (

                        <div className="podio">

                            <div className="podio-card plata">

                                <div className="medalla">
                                    🥈
                                </div>

                                <h4>
                                    {top3[1].nombre}
                                </h4>

                                <h2>
                                    {top3[1].puntos}
                                </h2>

                            </div>

                            <div className="podio-card oro">

                                <div className="medalla">
                                    🥇
                                </div>

                                <h4>
                                    {top3[0].nombre}
                                </h4>

                                <h2>
                                    {top3[0].puntos}
                                </h2>

                            </div>

                            <div className="podio-card bronce">

                                <div className="medalla">
                                    🥉
                                </div>

                                <h4>
                                    {top3[2].nombre}
                                </h4>

                                <h2>
                                    {top3[2].puntos}
                                </h2>

                            </div>

                        </div>

                    )
                }

                <div className="ranking-table">

                    <table className="table">

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Usuario</th>

                                <th>Pronósticos</th>

                                <th>Campeón</th>

                                <th>Total</th>

                            </tr>

                        </thead>

                        <tbody>

                            {ranking.map((item, index) => (

                                <tr
                                    key={index}
                                    className={
                                        item.id === usuario.id
                                            ? "usuario-actual"
                                            : ""
                                    }
                                >

                                    <td>{index + 1}</td>

                                    <td>{item.nombre}</td>

                                    <td>{item.puntos_pronosticos}</td>

                                    <td>{item.puntos_campeon}</td>

                                    <td>
                                        <strong>
                                            {item.puntos}
                                        </strong>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </>
    );
}

export default Ranking;