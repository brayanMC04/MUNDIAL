from flask import Blueprint

from controllers.partido_controller import (
    listar_partidos,
    crear_partido
)

partido_bp = Blueprint(
    "partidos",
    __name__
)

partido_bp.route(
    "/",
    methods=["GET"]
)(listar_partidos)

partido_bp.route(
    "/",
    methods=["POST"]
)(crear_partido)