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

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()