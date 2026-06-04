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
    methods=["POST"]
)(login)

auth_bp.route(
    "/perfil",
    methods=["GET"]
)(perfil)