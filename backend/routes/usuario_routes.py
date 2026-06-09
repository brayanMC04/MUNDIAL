from flask import Blueprint

from controllers.usuario_controller import (
    crear_usuario,
    obtener_usuarios,
    editar_usuario,
    eliminar_usuario   
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

usuario_bp.route(
    "/<int:usuario_id>",
    methods=["PUT"],
    strict_slashes=False
)(editar_usuario)

usuario_bp.route(
    "/<int:usuario_id>",
    methods=["DELETE"],
    strict_slashes=False
)(eliminar_usuario)
