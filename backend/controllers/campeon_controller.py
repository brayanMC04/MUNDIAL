from datetime import datetime
from flask import request, jsonify
from config.database import get_connection


def seleccionar_campeon():

    data = request.get_json()

    usuario_id = data.get("usuario_id")
    equipo_id = data.get("equipo_id")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT MIN(fecha_partido) AS inicio FROM partidos")
            inicio = cursor.fetchone().get("inicio")

        if inicio is not None:
            if isinstance(inicio, datetime):
                inicio_datetime = inicio
            else:
                inicio_datetime = datetime.combine(inicio, datetime.min.time())

            if inicio_datetime <= datetime.now():
                return jsonify({
                    "success": False,
                    "message": "Ya comenzó el mundial. No se puede cambiar el campeón."
                }), 403

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO campeon_usuario
                (
                    usuario_id,
                    equipo_id
                )
                VALUES
                (
                    %s,
                    %s
                )
                ON DUPLICATE KEY UPDATE
                    equipo_id = VALUES(equipo_id)
            """, (
                usuario_id,
                equipo_id
            ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Campeón guardado"
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()


def obtener_campeon_usuario(usuario_id):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT e.id, e.nombre
                FROM campeon_usuario cu
                JOIN equipos e ON cu.equipo_id = e.id
                WHERE cu.usuario_id = %s
            """, (usuario_id,))

            campeon = cursor.fetchone()

            return jsonify({
                "campeon": campeon or None
            }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()