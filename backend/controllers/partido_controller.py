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
