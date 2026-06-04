from flask import Blueprint

from controllers.equipo_controller import (
    listar_equipos,
    crear_equipo
)

equipo_bp = Blueprint(
    "equipos",
    __name__
)

equipo_bp.route(
    "/",
    methods=["GET"]
)(listar_equipos)

equipo_bp.route(
    "/",
    methods=["POST"]
)(crear_equipo)