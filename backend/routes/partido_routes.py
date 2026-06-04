from flask import Blueprint

from controllers.partido_controller import (
    listar_partidos,
    crear_partido,
    finalizar_partido
)

partido_bp = Blueprint(
    "partidos",
    __name__
)

partido_bp.route(
    "/",
    methods=["GET"],
    strict_slashes=False
)(listar_partidos)

partido_bp.route(
    "/",
    methods=["POST"],
    strict_slashes=False
)(crear_partido)

partido_bp.route(
    "/<int:partido_id>",
    methods=["PUT"],
    strict_slashes=False
)(finalizar_partido)