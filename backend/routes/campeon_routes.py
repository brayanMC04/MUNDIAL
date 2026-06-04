from flask import Blueprint

from controllers.campeon_controller import (
    seleccionar_campeon
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