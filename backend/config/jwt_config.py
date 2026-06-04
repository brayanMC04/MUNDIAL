import os
from dotenv import load_dotenv

load_dotenv()

class JWTConfig:
    SECRET_KEY = os.getenv("JWT_SECRET_KEY")