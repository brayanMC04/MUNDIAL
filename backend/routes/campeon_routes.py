from flask import Blueprint

from controllers.campeon_controller import (
    seleccionar_campeon,
    obtener_campeon_usuario
)

campeon_bp = Blueprint(
    "campeon",
    __name__
)

campeon_bp.route(
    "/",
    methods=["POST"],
    strict_slashes=False
)(seleccionar_campeon)

campeon_bp.route(
    "/usuario/<int:usuario_id>",
    methods=["GET"],
    strict_slashes=False
)(obtener_campeon_usuario)