import os
from flask import Flask
from flask_caching import Cache
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from apscheduler.schedulers.background import BackgroundScheduler
from controllers.equipo_controller import refresh_cache_equipos
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
app.config["CACHE_TYPE"] = "RedisCache" if os.getenv("REDIS_URL") else "SimpleCache"
app.config["CACHE_DEFAULT_TIMEOUT"] = int(os.getenv("CACHE_DEFAULT_TIMEOUT", "86400"))
app.config["API_FOOTBALL_BASE_URL"] = os.getenv("API_FOOTBALL_BASE_URL", "https://v3.football.api-sports.io")
app.config["API_FOOTBALL_HOST"] = os.getenv("API_FOOTBALL_HOST", "v3.football.api-sports.io")
app.config["API_FOOTBALL_KEY"] = os.getenv("API_FOOTBALL_KEY")
app.config["API_FOOTBALL_TOKEN"] = os.getenv("API_FOOTBALL_TOKEN")
app.config["API_FOOTBALL_COUNTRY"] = os.getenv("API_FOOTBALL_COUNTRY")
app.config["API_FOOTBALL_LEAGUE"] = os.getenv("API_FOOTBALL_LEAGUE")
app.config["API_FOOTBALL_SEASON"] = os.getenv("API_FOOTBALL_SEASON")
app.config["API_FOOTBALL_TEAMS_ENDPOINT"] = os.getenv("API_FOOTBALL_TEAMS_ENDPOINT", "/teams")
app.config["API_FOOTBALL_ENABLED"] = bool(
    app.config["API_FOOTBALL_KEY"] or app.config["API_FOOTBALL_TOKEN"]
)

jwt = JWTManager(app)

CORS(app, resources={r"/api/*": {"origins": "*"}})

cache = Cache(app)

# Scheduler: refresh external teams cache daily (default 02:00)
if app.config["API_FOOTBALL_ENABLED"]:
    scheduler = BackgroundScheduler()

    def _scheduled_refresh():
        with app.app_context():
            try:
                refresh_cache_equipos()
                app.logger.info("Equipos externos cache refreshed by scheduler")
            except Exception as exc:
                app.logger.exception("Scheduled equipos refresh failed: %s", exc)

    refresh_hour = int(os.getenv("CACHE_REFRESH_HOUR", "2"))
    scheduler.add_job(_scheduled_refresh, 'cron', hour=refresh_hour, minute=0)
    scheduler.start()
else:
    app.logger.info("API Football no está configurada; no se inicia el scheduler de refresco.")

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