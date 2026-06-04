from flask import request, jsonify
from config.database import get_connection


def seleccionar_campeon():

    data = request.get_json()

    usuario_id = data.get("usuario_id")
    equipo_id = data.get("equipo_id")

    connection = get_connection()

    try:

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