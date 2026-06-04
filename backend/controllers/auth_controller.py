from flask import request, jsonify
from flask_jwt_extended import create_access_token
from config.database import get_connection
from flask_jwt_extended import jwt_required, get_jwt_identity
import bcrypt


def login():

    data = request.get_json()

    cedula = data.get("cedula")
    password = data.get("password")

    if not cedula or not password:
        return jsonify({
            "success": False,
            "message": "Cédula y contraseña son obligatorias"
        }), 400

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            sql = """
                SELECT *
                FROM usuarios
                WHERE cedula = %s
            """

            cursor.execute(sql, (cedula,))
            usuario = cursor.fetchone()

            if not usuario:
                return jsonify({
                    "success": False,
                    "message": "Usuario no encontrado"
                }), 404

            password_db = usuario["password"].encode("utf-8")

            if not bcrypt.checkpw(
                password.encode("utf-8"),
                password_db
            ):
                return jsonify({
                    "success": False,
                    "message": "Contraseña incorrecta"
                }), 401

            access_token = create_access_token(
                identity=str(usuario["id"]),
                additional_claims={
                    "rol": usuario["rol"],
                    "cedula": usuario["cedula"]
                }
            )

            return jsonify({
                "success": True,
                "token": access_token,
                "usuario": {
                    "id": usuario["id"],
                    "nombre": usuario["nombre"],
                    "cedula": usuario["cedula"],
                    "rol": usuario["rol"],
                    "cambio_password": usuario["cambio_password"]
                }
            }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()


@jwt_required()
def perfil():

    usuario_id = get_jwt_identity()

    return jsonify({
        "success": True,
        "usuario_id": usuario_id
    })