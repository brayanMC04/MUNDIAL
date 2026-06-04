from flask import Blueprint

from controllers.pronostico_controller import (
    crear_pronostico,
    obtener_pronosticos_usuario
)

pronostico_bp = Blueprint(
    "pronosticos",
    __name__
)

pronostico_bp.route(
    "/",
    methods=["POST"],
    strict_slashes=False
)(crear_pronostico)

pronostico_bp.route(
    "/usuario/<int:usuario_id>",
    methods=["GET"],
    strict_slashes=False
)(obtener_pronosticos_usuario)