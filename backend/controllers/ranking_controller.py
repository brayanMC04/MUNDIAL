from flask import jsonify
from config.database import get_connection


def obtener_ranking():

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    u.nombre,
                    COALESCE(SUM(p.puntos), 0)
                    +
                    COALESCE(MAX(c.puntos), 0)
                    AS puntos
                FROM usuarios u

                LEFT JOIN pronosticos p
                    ON u.id = p.usuario_id

                LEFT JOIN campeon_usuario c
                    ON u.id = c.usuario_id

                GROUP BY u.id, u.nombre

                ORDER BY puntos DESC
            """)

            ranking = cursor.fetchall()

        return jsonify(ranking), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()