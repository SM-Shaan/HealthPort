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
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")

    print(f"[DATABASE] Building connection from individual variables")
    print(f"[DATABASE] Host: {DB_HOST}, Port: {DB_PORT}, Database: {DB_NAME}")

    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    # Railway provides mysql:// but we need mysql+pymysql://
    if DATABASE_URL.startswith("mysql://"):
        DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

    # Parse and log the URL
    try:
        parsed = urlparse(DATABASE_URL)

        # Only fix empty port issue if port is actually missing
        # Don't try to fix if port is already present
        if not parsed.port:
            # Fix empty port patterns
            DATABASE_URL = re.sub(r':@', ':3306@', DATABASE_URL)
            DATABASE_URL = re.sub(r':/', ':3306/', DATABASE_URL)
            DATABASE_URL = re.sub(r'@([^:/]+):/', r'@\1:3306/', DATABASE_URL)

            # Re-parse after fixing
            parsed = urlparse(DATABASE_URL)

        print(f"[DATABASE] Connecting to: {parsed.scheme}://{parsed.username}:***@{parsed.hostname}:{parsed.port}{parsed.path}")
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
