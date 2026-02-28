import os
from dotenv import load_dotenv

# Force loading from backend/.env explicitly since flask command runs from project root
from pathlib import Path
BASE_DIR = Path(__file__).parent.resolve()
env_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=env_path, override=True)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    
    # Ensure instance folder exists absolutely inside backend
    db_dir = BASE_DIR / 'instance'
    db_dir.mkdir(exist_ok=True)
    db_path = db_dir / 'app.db'
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f'sqlite:///{db_path}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
