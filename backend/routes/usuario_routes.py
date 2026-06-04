from flask import Blueprint

from controllers.usuario_controller import (
    crear_usuario,
    obtener_usuarios
)

usuario_bp = Blueprint(
    "usuarios",
    __name__
)

usuario_bp.route(
    "/",
    methods=["POST"],
    strict_slashes=False
)(crear_usuario)

usuario_bp.route(
    "/",
    methods=["GET"],
    strict_slashes=False
)(obtener_usuarios)
