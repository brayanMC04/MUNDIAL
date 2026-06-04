from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.equipo_routes import equipo_bp
from routes.auth_routes import auth_bp
from routes.partido_routes import partido_bp
from config.jwt_config import JWTConfig
from routes.pronostico_routes import pronostico_bp
from routes.campeon_routes import campeon_bp
from routes.ranking_routes import ranking_bp
from routes.usuario_routes import usuario_bp

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = JWTConfig.SECRET_KEY
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["CORS_HEADERS"] = "Content-Type,Authorization"

jwt = JWTManager(app)

CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

app.register_blueprint(
    equipo_bp,
    url_prefix="/api/equipos"
)

app.register_blueprint(
    partido_bp,
    url_prefix="/api/partidos"
)

app.register_blueprint(
    pronostico_bp,
    url_prefix="/api/pronosticos"
)

app.register_blueprint(
    campeon_bp,
    url_prefix="/api/campeon"
)

app.register_blueprint(
    usuario_bp,
    url_prefix="/api/usuarios"
)

app.register_blueprint(
    ranking_bp,
    url_prefix="/api/ranking"
)

@app.route("/")
def home():
    return {
        "success": True,
        "message": "API Mundial 2026 funcionando"
    }

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )