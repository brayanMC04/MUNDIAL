from datetime import date, datetime
from flask import request, jsonify
from config.database import get_connection


def crear_pronostico():

    data = request.get_json()

    usuario_id = data.get("usuario_id")
    partido_id = data.get("partido_id")
    pred_local = data.get("pred_local")
    pred_visitante = data.get("pred_visitante")

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    estado,
                    fecha_cierre
                FROM partidos
                WHERE id = %s
            """, (partido_id,))

            partido = cursor.fetchone()

            if not partido:
                return jsonify({
                    "success": False,
                    "message": "Partido no encontrado"
                }), 404

            fecha_cierre = partido["fecha_cierre"]
            ahora = datetime.now()

            if isinstance(fecha_cierre, date) and not isinstance(fecha_cierre, datetime):
                fecha_cierre = datetime.combine(fecha_cierre, datetime.min.time())

            if partido["estado"] != "pendiente" or fecha_cierre <= ahora:
                return jsonify({
                    "success": False,
                    "message": "El partido ya cerró. No se pueden guardar pronósticos."
                }), 400

            cursor.execute("""
                INSERT INTO pronosticos
                (
                    usuario_id,
                    partido_id,
                    pred_local,
                    pred_visitante
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s
                )
                ON DUPLICATE KEY UPDATE
                    pred_local = VALUES(pred_local),
                    pred_visitante = VALUES(pred_visitante),
                    fecha_pronostico = NOW(),
                    puntos = 0,
                    calificado = FALSE
            """, (
                usuario_id,
                partido_id,
                pred_local,
                pred_visitante
            ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Pronóstico guardado"
        }), 201

    except Exception as e:

        if "Duplicate entry" in str(e):
            return jsonify({
                "success": False,
                "message": "Ya existe un pronóstico para este partido."
            }), 400

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()


def obtener_pronosticos_usuario(usuario_id):

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    pr.id,
                    pr.partido_id,
                    pr.pred_local,
                    pr.pred_visitante,
                    pr.puntos,
                    pr.calificado,
                    pr.fecha_pronostico,
                    el.nombre AS equipo_local,
                    ev.nombre AS equipo_visitante,
                    pa.fecha_partido,
                    pa.fecha_cierre,
                    pa.estado,
                    pa.goles_local,
                    pa.goles_visitante
                FROM pronosticos pr
                JOIN partidos pa ON pa.id = pr.partido_id
                LEFT JOIN equipos el ON el.id = pa.equipo_local_id
                LEFT JOIN equipos ev ON ev.id = pa.equipo_visitante_id
                WHERE pr.usuario_id = %s
                ORDER BY pa.fecha_partido ASC, pr.fecha_pronostico DESC
            """, (usuario_id,))

            pronosticos = cursor.fetchall()

            for pronostico in pronosticos:
                if isinstance(pronostico.get("fecha_pronostico"), (date, datetime)):
                    pronostico["fecha_pronostico"] = pronostico["fecha_pronostico"].isoformat()
                if isinstance(pronostico.get("fecha_partido"), (date, datetime)):
                    pronostico["fecha_partido"] = pronostico["fecha_partido"].isoformat()
                if isinstance(pronostico.get("fecha_cierre"), (date, datetime)):
                    pronostico["fecha_cierre"] = pronostico["fecha_cierre"].isoformat()

        return jsonify({
            "success": True,
            "pronosticos": pronosticos
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()