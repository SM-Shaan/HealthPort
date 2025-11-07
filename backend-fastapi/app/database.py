from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import re
from urllib.parse import urlparse, urlunparse
from dotenv import load_dotenv

load_dotenv()

# Try to use DATABASE_URL first (provided by Railway MySQL)
DATABASE_URL = os.getenv("DATABASE_URL")

# Also check for Railway's individual MySQL variables
MYSQL_HOST = os.getenv("MYSQLHOST")
MYSQL_PORT = os.getenv("MYSQLPORT")
MYSQL_USER = os.getenv("MYSQLUSER")
MYSQL_PASSWORD = os.getenv("MYSQLPASSWORD")
MYSQL_DATABASE = os.getenv("MYSQLDATABASE")

# If DATABASE_URL is not provided, construct it from individual variables
if not DATABASE_URL:
    # Try Railway variables first, then fall back to custom DB_ variables
    DB_HOST = MYSQL_HOST or os.getenv("DB_HOST", "localhost")
    DB_PORT = MYSQL_PORT or os.getenv("DB_PORT", "3306")
    DB_USER = MYSQL_USER or os.getenv("DB_USER", "root")
    DB_PASSWORD = MYSQL_PASSWORD or os.getenv("DB_PASSWORD", "")
    DB_NAME = MYSQL_DATABASE or os.getenv("DB_NAME", "edoc")

    print(f"[DATABASE] Building connection from individual variables")
    print(f"[DATABASE] Host: {DB_HOST}, Port: {DB_PORT}, Database: {DB_NAME}")

    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    # Railway provides mysql:// but we need mysql+pymysql://
    if DATABASE_URL.startswith("mysql://"):
        DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

    # Fix empty port issue by parsing and reconstructing the URL
    # This handles Railway's DATABASE_URL format when port is empty or malformed
    try:
        # First, fix obvious empty port patterns
        DATABASE_URL = re.sub(r':@', ':3306@', DATABASE_URL)
        DATABASE_URL = re.sub(r':/', ':3306/', DATABASE_URL)
        DATABASE_URL = re.sub(r'@([^:/]+):/', r'@\1:3306/', DATABASE_URL)

        # Parse the URL to ensure it's valid
        parsed = urlparse(DATABASE_URL)

        # If port is still not set or is empty, set it to 3306
        if not parsed.port or parsed.port == '':
            # Reconstruct with explicit port
            netloc = f"{parsed.username}:{parsed.password}@{parsed.hostname}:3306" if parsed.password else f"{parsed.username}@{parsed.hostname}:3306"
            DATABASE_URL = urlunparse((
                parsed.scheme,
                netloc,
                parsed.path,
                parsed.params,
                parsed.query,
                parsed.fragment
            ))

        print(f"[DATABASE] Connecting to: {parsed.scheme}://{parsed.username}:***@{parsed.hostname}:{parsed.port or 3306}{parsed.path}")
    except Exception as e:
        print(f"[WARNING] Error parsing DATABASE_URL: {e}")
        print(f"[DATABASE] Using DATABASE_URL as-is")

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
