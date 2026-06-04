from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from config.database import get_connection


def es_admin():
    claims = get_jwt()
    return claims.get("rol") == "admin"


def listar_equipos():

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT *
                FROM equipos
                ORDER BY nombre
            """)

            equipos = cursor.fetchall()

            return jsonify(equipos), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()


@jwt_required()
def crear_equipo():

    if not es_admin():
        return jsonify({
            "success": False,
            "message": "Acceso denegado. Se requiere rol admin."
        }), 403

    data = request.get_json()

    nombre = data.get("nombre")
    codigo_fifa = data.get("codigo_fifa")
    bandera_url = data.get("bandera_url")

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                INSERT INTO equipos
                (
                    nombre,
                    codigo_fifa,
                    bandera_url
                )
                VALUES (%s,%s,%s)
            """, (
                nombre,
                codigo_fifa,
                bandera_url
            ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Equipo creado"
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()