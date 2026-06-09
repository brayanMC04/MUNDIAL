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


# 🔐 CORREGIDO: Añadimos protección JWT y encriptación idéntica con bcrypt
@jwt_required()
def editar_usuario(usuario_id):
    if not es_admin():
        return jsonify({
            "success": False,
            "message": "Acceso denegado. Se requiere rol admin."
        }), 403

    data = request.get_json()
    
    cedula = data.get("cedula")
    nombre = data.get("nombre")
    password_nueva = data.get("password")
    rol = data.get("rol", "usuario")

    if not cedula or not nombre:
        return jsonify({"success": False, "message": "La cédula y el nombre son obligatorios."}), 400

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # Verificar si el usuario existe y obtener su contraseña actual
            cursor.execute("SELECT id, password FROM usuarios WHERE id = %s", (usuario_id,))
            usuario_actual = cursor.fetchone()
            
            if not usuario_actual:
                return jsonify({"success": False, "message": "Usuario no encontrado."}), 404

            # 🛠️ SOLUCIÓN AL INVALID SALT:
            # Si el admin escribió una contraseña, la procesamos usando exactamente la lógica de tu registro
            if password_nueva and password_nueva.strip() != "":
                password_final = bcrypt.hashpw(
                    password_nueva.encode("utf-8"),
                    bcrypt.gensalt()
                ).decode("utf-8")
            else:
                # Si vino vacía, conservamos el hash que ya existía en la BD intacto
                password_final = usuario_actual["password"]

            # Ejecutamos la actualización
            cursor.execute("""
                UPDATE usuarios 
                SET cedula = %s, nombre = %s, password = %s, rol = %s 
                WHERE id = %s
            """, (cedula, nombre, password_final, rol, usuario_id))
            
        connection.commit()
        return jsonify({"success": True, "message": "Usuario actualizado con éxito."}), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        connection.close()


# 🔐 CORREGIDO: Añadimos protección JWT para que nadie externo pueda borrar usuarios
@jwt_required()
def eliminar_usuario(usuario_id):
    if not es_admin():
        return jsonify({
            "success": False,
            "message": "Acceso denegado. Se requiere rol admin."
        }), 403

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM usuarios WHERE id = %s", (usuario_id,))
            if not cursor.fetchone():
                return jsonify({"success": False, "message": "Usuario no encontrado"}), 404

            cursor.execute("DELETE FROM usuarios WHERE id = %s", (usuario_id,))
            
        connection.commit()
        return jsonify({
            "success": True, 
            "message": "Usuario eliminado correctamente"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False, 
            "message": f"Error al eliminar usuario: {str(e)}"
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