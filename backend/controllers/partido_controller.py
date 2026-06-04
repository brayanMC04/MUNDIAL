from flask import request, jsonify
from config.database import get_connection


def listar_partidos():

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    p.*,
                    el.nombre AS equipo_local,
                    ev.nombre AS equipo_visitante
                FROM partidos p

                INNER JOIN equipos el
                    ON p.equipo_local_id = el.id

                INNER JOIN equipos ev
                    ON p.equipo_visitante_id = ev.id

                ORDER BY p.fecha_partido
            """)

            partidos = cursor.fetchall()

            return jsonify(partidos), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()

def crear_partido():

    data = request.get_json()

    equipo_local_id = data.get("equipo_local_id")
    equipo_visitante_id = data.get("equipo_visitante_id")
    fecha_partido = data.get("fecha_partido")
    fecha_cierre = data.get("fecha_cierre")
    fase = data.get("fase")

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                INSERT INTO partidos
                (
                    fase,
                    equipo_local_id,
                    equipo_visitante_id,
                    fecha_partido,
                    fecha_cierre,
                    estado
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    'pendiente'
                )
            """, (
                fase,
                equipo_local_id,
                equipo_visitante_id,
                fecha_partido,
                fecha_cierre
            ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Partido creado"
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()


def calcular_puntos(pred_local, pred_visitante, goles_local, goles_visitante):
    if pred_local == goles_local and pred_visitante == goles_visitante:
        return 3

    resultado_pred = 0 if pred_local == pred_visitante else (1 if pred_local > pred_visitante else -1)
    resultado_real = 0 if goles_local == goles_visitante else (1 if goles_local > goles_visitante else -1)

    return 1 if resultado_pred == resultado_real else 0


def finalizar_partido(partido_id):
    data = request.get_json()

    goles_local = data.get("goles_local")
    goles_visitante = data.get("goles_visitante")

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT id
                FROM partidos
                WHERE id = %s
            """, (partido_id,))

            partido = cursor.fetchone()

            if not partido:
                return jsonify({
                    "success": False,
                    "message": "Partido no encontrado"
                }), 404

            cursor.execute("""
                UPDATE partidos
                SET goles_local = %s,
                    goles_visitante = %s,
                    estado = 'finalizado',
                    ultima_actualizacion = NOW()
                WHERE id = %s
            """, (
                goles_local,
                goles_visitante,
                partido_id
            ))

            cursor.execute("""
                SELECT id, pred_local, pred_visitante
                FROM pronosticos
                WHERE partido_id = %s
            """, (partido_id,))

            pronosticos = cursor.fetchall()

            for pronostico in pronosticos:
                puntos = calcular_puntos(
                    pronostico["pred_local"],
                    pronostico["pred_visitante"],
                    goles_local,
                    goles_visitante
                )

                cursor.execute("""
                    UPDATE pronosticos
                    SET puntos = %s,
                        calificado = TRUE
                    WHERE id = %s
                """, (
                    puntos,
                    pronostico["id"]
                ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Partido finalizado y pronósticos calificados",
            "partido_id": partido_id,
            "pronosticos_calificados": len(pronosticos)
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()
