import bcrypt
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from config.database import get_connection


def es_admin():
    claims = get_jwt()
    return claims.get("rol") == "admin"


@jwt_required()
def crear_usuario():

    if not es_admin():
        return jsonify({
            "success": False,
            "message": "Acceso denegado. Se requiere rol admin."
        }), 403

    data = request.get_json()

    cedula = data.get("cedula")
    nombre = data.get("nombre")
    password = data.get("password")
    rol = data.get("rol", "usuario")

    if not cedula or not nombre or not password:
        return jsonify({
            "success": False,
            "message": "Cédula, nombre y contraseña son obligatorios."
        }), 400

    if rol not in ["admin", "usuario"]:
        rol = "usuario"

    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO usuarios(
                    cedula,
                    nombre,
                    password,
                    rol
                ) VALUES (%s, %s, %s, %s)
            """, (
                cedula,
                nombre,
                password_hash,
                rol
            ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Usuario creado correctamente."
        }), 201

    except Exception as e:
        if "Duplicate entry" in str(e):
            return jsonify({
                "success": False,
                "message": "Ya existe un usuario con esa cédula."
            }), 400

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()


@jwt_required()
def obtener_usuarios():

    if not es_admin():
        return jsonify({
            "success": False,
            "message": "Acceso denegado. Se requiere rol admin."
        }), 403

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    cedula,
                    nombre,
                    area,
                    rol,
                    cambio_password,
                    fecha_creacion
                FROM usuarios
                ORDER BY fecha_creacion DESC
            """)

            usuarios = cursor.fetchall()

        return jsonify({
            "success": True,
            "usuarios": usuarios
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()
