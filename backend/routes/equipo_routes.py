from flask import Blueprint

from controllers.equipo_controller import (
    listar_equipos,
    listar_equipos_externos,
    refrescar_equipos_externos,
    crear_equipo
)

equipo_bp = Blueprint(
    "equipos",
    __name__
)

equipo_bp.route(
    "/",
    methods=["GET"],
    strict_slashes=False
)(listar_equipos)

equipo_bp.route(
    "/externos",
    methods=["GET"],
    strict_slashes=False
)(listar_equipos_externos)

equipo_bp.route(
    "/externos/refresh",
    methods=["POST"],
    strict_slashes=False
)(refrescar_equipos_externos)

equipo_bp.route(
    "/",
    methods=["POST"],
    strict_slashes=False
)(crear_equipo)