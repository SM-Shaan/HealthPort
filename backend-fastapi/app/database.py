from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import re
from dotenv import load_dotenv

load_dotenv()

# Try to use DATABASE_URL first (provided by Railway MySQL)
DATABASE_URL = os.getenv("DATABASE_URL")

# If DATABASE_URL is not provided, construct it from individual variables
if not DATABASE_URL:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_NAME = os.getenv("DB_NAME", "edoc")
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    # Railway provides mysql:// but we need mysql+pymysql://
    if DATABASE_URL.startswith("mysql://"):
        DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

    # Fix empty port issue: mysql://user:pass@host:/db -> mysql://user:pass@host:3306/db
    # This handles Railway's DATABASE_URL format when port is empty
    DATABASE_URL = re.sub(r':@', ':3306@', DATABASE_URL)  # Empty port before @
    DATABASE_URL = re.sub(r':/', ':3306/', DATABASE_URL)  # Empty port before /

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
