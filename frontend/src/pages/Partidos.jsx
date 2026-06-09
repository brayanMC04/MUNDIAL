import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPartidos } from "../services/partidoService";
import "../styles/partidos.css";

function Partidos() {
    const [partidos, setPartidos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarPartidos();
    }, []);

    const cargarPartidos = async () => {
        try {
            const data = await obtenerPartidos();
            setPartidos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    // 🆕 FUNCIÓN AUXILIAR REPARADA Y ROBUSTA
    const formatearFecha = (fechaOriginal) => {
        if (!fechaOriginal) return "Fecha no disponible";

        try {
            // 1. Nos aseguramos de que sea un string antes de manipularlo
            let fechaString = String(fechaOriginal);

            // 2. Si viene con la zona horaria 'Z' u otra variante, la limpiamos
            // Reemplazamos el espacio por una 'T' para congelar la zona horaria local
            if (fechaString.includes(" ")) {
                fechaString = fechaString.replace(" ", "T");
            }

            const fechaFija = new Date(fechaString);

            // 3. Si el navegador todavía no la entiende, hacemos un último intento limpio
            if (isNaN(fechaFija.getTime())) {
                // Si la fecha venía como "2026-06-05T09:07:00.000Z", le quitamos la Z del final
                const fechaLimpia = fechaString.split('.')[0].replace('Z', '');
                const intentoAlterno = new Date(fechaLimpia);
                if (!isNaN(intentoAlterno.getTime())) {
                    return intentoAlterno.toLocaleString('es-CO', { 
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', hour12: true 
                    });
                }
                return fechaOriginal; // Si falla todo, muestra el texto tal cual viene de la BD
            }
            
            return fechaFija.toLocaleString('es-CO', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true 
            });
        } catch (error) {
            console.error("Error al formatear fecha:", error);
            return String(fechaOriginal);
        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">
                <div className="partidos-header">

                    <h1 className="partidos-title">
                        ⚽ Mundial 2026
                    </h1>

                    <p className="partidos-subtitle">
                        Calendario oficial de partidos
                    </p>

                </div>

                {cargando ? (
                    <p>Cargando partidos...</p>
                ) : partidos.length === 0 ? (
                    <p>No hay partidos disponibles.</p>
                ) : (
                    <div className="row">
                        {partidos.map((partido) => (
                            <div className="col-md-6" key={partido.id}>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="partido-equipos">

                                            <div className="equipo">
                                                {partido.equipo_local}
                                            </div>

                                            <div className="vs">
                                                VS
                                            </div>

                                            <div className="equipo">
                                                {partido.equipo_visitante}
                                            </div>

                                        </div>
                                        <p className="card-text mb-1">
                                            <strong>Fase:</strong> {partido.fase}
                                        </p>
                                        <p className="card-text mb-1">
                                            {/* 🔄 Cambiado para usar nuestra nueva función fija */}
                                            <strong>Fecha:</strong> {formatearFecha(partido.fecha_partido)}
                                        </p>
                                        <div className={`estado-badge estado-${partido.estado}`}>
                                            {partido.estado}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Partidos;