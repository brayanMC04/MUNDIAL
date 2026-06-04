from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from config.database import get_connection
import requests

CACHE_KEY_EQUIPOS_EXTERNOS = "equipos_externos_list"


def es_admin():
    claims = get_jwt()
    return claims.get("rol") == "admin"


def api_football_enabled():
    return bool(
        current_app.config.get("API_FOOTBALL_KEY")
        or current_app.config.get("API_FOOTBALL_TOKEN")
    )


def _normalize_equipo(equipo, index=0):
    if not isinstance(equipo, dict):
        return {
            "id": f"equipo-{index}",
            "nombre": str(equipo)
        }

    if isinstance(equipo.get("team"), dict):
        equipo = {**equipo, **equipo["team"]}

    id_value = (
        equipo.get("id")
        or equipo.get("team_id")
        or equipo.get("code")
        or equipo.get("codigo")
        or equipo.get("clave")
        or equipo.get("name")
        or equipo.get("short_name")
        or equipo.get("full_name")
        or f"equipo-{index}"
    )

    nombre_value = (
        equipo.get("nombre")
        or equipo.get("name")
        or equipo.get("full_name")
        or equipo.get("short_name")
        or equipo.get("label")
        or str(id_value)
    )

    return {
        "id": id_value,
        "nombre": nombre_value,
        "bandera_url": (
            equipo.get("bandera_url")
            or equipo.get("flag")
            or equipo.get("crestUrl")
            or equipo.get("logo")
            or equipo.get("logo_path")
        )
    }


def _build_api_football_headers():
    api_key = current_app.config.get("API_FOOTBALL_KEY")
    api_host = current_app.config.get("API_FOOTBALL_HOST")
    token = current_app.config.get("API_FOOTBALL_TOKEN")

    headers = {
        "Accept": "application/json"
    }

    if api_key and api_host:
        headers["X-RapidAPI-Key"] = api_key
        headers["X-RapidAPI-Host"] = api_host
    elif token:
        headers["Authorization"] = f"Bearer {token}"

    return headers


def _build_api_football_params():
    params = {}
    country = current_app.config.get("API_FOOTBALL_COUNTRY")
    league = current_app.config.get("API_FOOTBALL_LEAGUE")
    season = current_app.config.get("API_FOOTBALL_SEASON")

    if country:
        params["country"] = country
    if league:
        params["league"] = league
    if season:
        params["season"] = season

    return params


def _fetch_equipos_externos():
    api_key = current_app.config.get("API_FOOTBALL_KEY")
    token = current_app.config.get("API_FOOTBALL_TOKEN")

    if api_key or token:
        base_url = current_app.config.get("API_FOOTBALL_BASE_URL")
        endpoint = current_app.config.get("API_FOOTBALL_TEAMS_ENDPOINT")
        if not base_url or not endpoint:
            raise RuntimeError("API Football no está configurada correctamente.")

        url = f"{base_url.rstrip('/')}{endpoint}"
        params = _build_api_football_params()
        if not params:
            raise RuntimeError("Configura API_FOOTBALL_COUNTRY o API_FOOTBALL_LEAGUE para obtener equipos.")

        response = requests.get(
            url,
            params=params,
            headers=_build_api_football_headers(),
            timeout=10
        )
    else:
        raise RuntimeError("No hay credenciales configuradas para API Football.")

    response.raise_for_status()
    payload = response.json()

    if isinstance(payload, dict) and payload.get("response") is not None:
        return payload["response"]

    return payload


def refresh_cache_equipos():
    """Fetch from API-Football, normalize and store into cache. Returns equipos list."""
    if not api_football_enabled():
        raise RuntimeError("API Football no está configurada.")

    cache = current_app.extensions.get("cache")

    raw_data = _fetch_equipos_externos()

    if isinstance(raw_data, dict) and isinstance(raw_data.get("response"), list):
        raw_list = raw_data.get("response")
    elif isinstance(raw_data, list):
        raw_list = raw_data
    else:
        raw_list = [raw_data]

    equipos = [
        _normalize_equipo(item, index)
        for index, item in enumerate(raw_list)
    ]

    if cache:
        cache.set(
            CACHE_KEY_EQUIPOS_EXTERNOS,
            equipos,
            timeout=current_app.config.get("CACHE_DEFAULT_TIMEOUT", 86400)
        )

    return equipos


def listar_equipos_externos():
    if not api_football_enabled():
        return listar_equipos()

    cache = current_app.extensions.get("cache")
    if cache:
        cached = cache.get(CACHE_KEY_EQUIPOS_EXTERNOS)
        if cached:
            return jsonify(cached), 200

    try:
        raw_data = _fetch_equipos_externos()

        if isinstance(raw_data, dict) and isinstance(raw_data.get("response"), list):
            raw_list = raw_data.get("response")
        elif isinstance(raw_data, list):
            raw_list = raw_data
        else:
            raw_list = [raw_data]

        equipos = [
            _normalize_equipo(item, index)
            for index, item in enumerate(raw_list)
        ]

        if cache:
            cache.set(
                CACHE_KEY_EQUIPOS_EXTERNOS,
                equipos,
                timeout=current_app.config.get("CACHE_DEFAULT_TIMEOUT", 86400)
            )

        return jsonify(equipos), 200
    except requests.RequestException as exc:
        if cache:
            stale = cache.get(CACHE_KEY_EQUIPOS_EXTERNOS)
            if stale:
                return jsonify(stale), 200

        return jsonify({
            "success": False,
            "message": "No se pudo cargar equipos externos.",
            "details": str(exc)
        }), 502
    except Exception as exc:
        return jsonify({
            "success": False,
            "message": str(exc)
        }), 500


@jwt_required()
def refrescar_equipos_externos():
    if not es_admin():
        return jsonify({
            "success": False,
            "message": "Acceso denegado. Se requiere rol admin."
        }), 403

    if not api_football_enabled():
        return jsonify({
            "success": False,
            "message": "API Football no está configurada. No se puede refrescar la cache."
        }), 503

    cache = current_app.extensions.get("cache")

    try:
        raw_data = _fetch_equipos_externos()

        if isinstance(raw_data, dict) and isinstance(raw_data.get("response"), list):
            raw_list = raw_data.get("response")
        elif isinstance(raw_data, list):
            raw_list = raw_data
        else:
            raw_list = [raw_data]

        equipos = [
            _normalize_equipo(item, index)
            for index, item in enumerate(raw_list)
        ]

        if cache:
            cache.set(
                CACHE_KEY_EQUIPOS_EXTERNOS,
                equipos,
                timeout=current_app.config.get("CACHE_DEFAULT_TIMEOUT", 86400)
            )

        return jsonify({
            "success": True,
            "message": "Cache de equipos externos actualizada.",
            "equipos": equipos
        }), 200
    except requests.RequestException as exc:
        return jsonify({
            "success": False,
            "message": "No se pudo actualizar la cache de equipos externos.",
            "details": str(exc)
        }), 502
    except Exception as exc:
        return jsonify({
            "success": False,
            "message": str(exc)
        }), 500


def listar_equipos():

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT *
                FROM equipos
                ORDER BY nombre
            """)

            equipos = cursor.fetchall()

            return jsonify(equipos), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()


@jwt_required()
def crear_equipo():

    if not es_admin():
        return jsonify({
            "success": False,
            "message": "Acceso denegado. Se requiere rol admin."
        }), 403

    data = request.get_json()

    nombre = data.get("nombre")
    codigo_fifa = data.get("codigo_fifa")
    bandera_url = data.get("bandera_url")

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute("""
                INSERT INTO equipos
                (
                    nombre,
                    codigo_fifa,
                    bandera_url
                )
                VALUES (%s,%s,%s)
            """, (
                nombre,
                codigo_fifa,
                bandera_url
            ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Equipo creado"
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        connection.close()