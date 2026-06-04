from flask import Blueprint
from controllers.auth_controller import (
    login,
    perfil
)

auth_bp = Blueprint(
    "auth",
    __name__
)

auth_bp.route(
    "/login",
    methods=["POST"],
    strict_slashes=False
)(login)

auth_bp.route(
    "/perfil",
    methods=["GET"],
    strict_slashes=False
)(perfil)