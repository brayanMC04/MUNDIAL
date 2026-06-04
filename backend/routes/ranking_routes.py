from flask import Blueprint
from controllers.ranking_controller import obtener_ranking

ranking_bp = Blueprint(
    "ranking",
    __name__
)

ranking_bp.route(
    "/",
    methods=["GET"],
    strict_slashes=False
)(obtener_ranking)