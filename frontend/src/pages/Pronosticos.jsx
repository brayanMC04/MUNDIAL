import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { obtenerPartidos } from "../services/partidoService";
import { guardarPronostico } from "../services/pronosticoService";
import "../styles/pronosticos.css";

function Pronosticos() {

    // Convierte el string plano del backend respetando la hora local exacta
    const obtenerFechaObjeto = (fechaOriginal) => {
        if (!fechaOriginal) return new Date();
        
        let fechaString = String(fechaOriginal);
        
        // Reemplaza el espacio si viene de la base de datos directo
        if (fechaString.includes(" ")) {
            fechaString = fechaString.replace(" ", "T");
        }
        
        // Al no llevar una 'Z' al final, este constructor leerá la hora exacta de tu PC
        const fechaObjeto = new Date(fechaString);
        
        if (isNaN(fechaObjeto.getTime())) {
            // Intento de limpieza si tiene milisegundos remanentes
            const fechaLimpia = fechaString.split('.')[0];
            return new Date(fechaLimpia);
        }

        return fechaObjeto;
    };

    // 1. CALCULAR TIEMPO RESTANTE (Cancelando desfases de Horarios de Verano / 1 hora fantasma)
    const calcularTiempoRestante = (fechaCierreOriginal) => {
        if (!fechaCierreOriginal) return "Cerrado";

        try {
            const fechaCierreFija = obtenerFechaObjeto(fechaCierreOriginal);
            const ahora = new Date();

            // Calculamos la diferencia bruta de tiempo
            let diferencia = fechaCierreFija.getTime() - ahora.getTime();

            // 🚨 SOLUCIÓN A LA HORA FANTASMA:
            // Comparamos los desfases de minutos de ambas fechas (Cierre vs Ahora).
            // Si el navegador le sumó 1 hora a la fecha futura por horario de verano, se la restamos.
            const desfaseCierre = fechaCierreFija.getTimezoneOffset();
            const desfaseAhora = ahora.getTimezoneOffset();
            const diferenciaDesfase = (desfaseCierre - desfaseAhora) * 60000;

            diferencia += diferenciaDesfase;

            if (diferencia <= 0) return "Cerrado";

            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)); // 🆕 Agregamos minutos para ver la cuenta exacta

            // Si queda menos de una hora, te mostrará los minutos restantes de forma clara
            if (dias === 0 && horas === 0) {
                return `${minutos} min`;
            }

            return `${dias}d ${horas}h`;
        } catch (e) {
            return "Cerrado";
        }
    };

    // 2. FUNCIÓN AUXILIAR: Muestra la fecha del partido de manera limpia
    const formatearFecha = (fechaOriginal) => {
        if (!fechaOriginal) return "Fecha no disponible";

        try {
            let fechaString = String(fechaOriginal);

            if (fechaString.includes(" ")) {
                fechaString = fechaString.replace(" ", "T");
            }

            let fechaFija = new Date(fechaString);

            if (isNaN(fechaFija.getTime())) {
                const fechaLimpia = fechaString.split('.')[0].replace('Z', '');
                fechaFija = new Date(fechaLimpia);
            }

            if (isNaN(fechaFija.getTime())) {
                return String(fechaOriginal); 
            }
            
            return fechaFija.toLocaleString('es-CO', { 
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hour12: true 
            });
        } catch (error) {
            return String(fechaOriginal);
        }
    };

    // --- ESTADOS DE LA APLICACIÓN ---
    const [partidos, setPartidos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        cargarPartidos();
    }, []);

    // 3. FUNCIÓN: Carga y filtra únicamente los partidos abiertos
    const cargarPartidos = async () => {
        try {
            const data = await obtenerPartidos();
            const abiertos = data.filter((partido) => {
                let fechaString = String(partido.fecha_cierre);
                if (fechaString.includes(" ")) {
                    fechaString = fechaString.replace(" ", "T");
                }
                
                let fechaCierreFija = new Date(fechaString);
                if (isNaN(fechaCierreFija.getTime())) {
                    const fechaLimpia = fechaString.split('.')[0].replace('Z', '');
                    fechaCierreFija = new Date(fechaLimpia);
                }

                const ahora = new Date();

                // Validación de cierre idéntica usando milisegundos absolutos
                const cerrado =
                    partido.estado !== "pendiente" ||
                    (!isNaN(fechaCierreFija.getTime()) && fechaCierreFija.getTime() <= ahora.getTime());

                return !cerrado;
            });

            setPartidos(abiertos);
        } catch (error) {
            console.error(error);
        }
    };

    // 4. FUNCIÓN: Guarda el pronóstico del usuario
    const guardar = async (partido) => {
        try {
            let fechaString = String(partido.fecha_cierre);
            if (fechaString.includes(" ")) {
                fechaString = fechaString.replace(" ", "T");
            }
            let fechaCierreFija = new Date(fechaString);
            if (isNaN(fechaCierreFija.getTime())) {
                const fechaLimpia = fechaString.split('.')[0].replace('Z', '');
                fechaCierreFija = new Date(fechaLimpia);
            }

            const ahora = new Date();
            const partidoCerrado =
                partido.estado !== "pendiente" ||
                (!isNaN(fechaCierreFija.getTime()) && fechaCierreFija.getTime() <= ahora.getTime());

            if (partidoCerrado) {
                setError("El partido ya cerró. No se puede guardar el pronóstico.");
                setMensaje("");
                return;
            }

            const usuario = JSON.parse(localStorage.getItem("usuario"));

            const response = await guardarPronostico({
                usuario_id: usuario.id,
                partido_id: partido.id,
                pred_local: partido.pred_local || 0,
                pred_visitante: partido.pred_visitante || 0
            });

            setMensaje(response.message || "Pronóstico guardado");
            setError("");
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Error guardando pronóstico"
            );
            setMensaje("");
        }
    };

    const actualizarMarcador = (id, campo, valor) => {
        const nuevosPartidos = partidos.map((p) => {
            if (p.id === id) {
                return { ...p, [campo]: valor };
            }
            return p;
        });
        setPartidos(nuevosPartidos);
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <div className="pronosticos-header">
                    <h1 className="pronosticos-title">🎯 Mis Pronósticos</h1>
                    <p className="pronosticos-subtitle">
                        Predice los resultados y sube en el ranking mundialista
                    </p>
                </div>

                {mensaje && <div className="alert alert-success" role="alert">{mensaje}</div>}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}

                {partidos.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                        No hay partidos abiertos para pronosticar.
                    </div>
                ) : (
                    partidos.map((partido) => {
                        let fechaString = String(partido.fecha_cierre);
                        if (fechaString.includes(" ")) {
                            fechaString = fechaString.replace(" ", "T");
                        }
                        let fechaCierreFija = new Date(fechaString);
                        if (isNaN(fechaCierreFija.getTime())) {
                            const fechaLimpia = fechaString.split('.')[0].replace('Z', '');
                            fechaCierreFija = new Date(fechaLimpia);
                        }

                        const ahora = new Date();
                        const partidoCerrado =
                            partido.estado !== "pendiente" ||
                            (!isNaN(fechaCierreFija.getTime()) && fechaCierreFija.getTime() <= ahora.getTime());

                        return (
                            <div key={partido.id} className="card mb-4 partido-card">
                                <div className="card-body">

                                    <div className="partido-header">
                                        <h3>
                                            {partido.equipo_local}{" "}
                                            <span className="vs-text">VS</span>{" "}
                                            {partido.equipo_visitante}
                                        </h3>
                                    </div>

                                    <div className="partido-info">
                                        📅 {formatearFecha(partido.fecha_partido)}
                                    </div>

                                    <div className="partido-tiempo">
                                        ⏳ Cierra en:{" "}
                                        <span>
                                            {calcularTiempoRestante(partido.fecha_cierre)}
                                        </span>
                                    </div>

                                    <p>
                                        <strong>Estado:</strong> {partido.estado}
                                    </p>

                                    {partido.estado === "finalizado" && (
                                        <p>
                                            <strong>Resultado oficial:</strong> {partido.goles_local} - {partido.goles_visitante}
                                        </p>
                                    )}

                                    <div className="row align-items-center text-center">
                                        <div className="col-md-5">
                                            <h5 className="equipo-nombre">{partido.equipo_local}</h5>
                                            <input
                                                type="number"
                                                className="form-control marcador-input"
                                                min="0"
                                                value={partido.pred_local || ""}
                                                disabled={partidoCerrado}
                                                onChange={(e) =>
                                                    actualizarMarcador(partido.id, "pred_local", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-md-2">
                                            <div className="vs-icon">⚔️</div>
                                        </div>

                                        <div className="col-md-5">
                                            <h5 className="equipo-nombre">{partido.equipo_visitante}</h5>
                                            <input
                                                type="number"
                                                className="form-control marcador-input"
                                                min="0"
                                                value={partido.pred_visitante || ""}
                                                disabled={partidoCerrado}
                                                onChange={(e) =>
                                                    actualizarMarcador(partido.id, "pred_visitante", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center mt-4">
                                        <button
                                            className="btn btn-primary btn-lg pronosticos-guardar"
                                            disabled={partidoCerrado}
                                            onClick={() => guardar(partido)}
                                        >
                                            🎯 Guardar Pronóstico
                                        </button>

                                        {partidoCerrado && (
                                            <div className="mt-3">
                                                <span className="badge bg-secondary">
                                                    Pronóstico cerrado
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}

export default Pronosticos;