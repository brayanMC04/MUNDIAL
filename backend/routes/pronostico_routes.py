from flask import Blueprint

from controllers.pronostico_controller import (
    crear_pronostico
)

pronostico_bp = Blueprint(
    "pronosticos",
    __name__
)

pronostico_bp.route(
    "/",
    methods=["POST"]
)(crear_pronostico)