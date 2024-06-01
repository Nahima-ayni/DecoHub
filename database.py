#!/usr/bin/python3

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base  # Ensure models.py defines the Base class and other models
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv('.env')

# Get the database URI from environment variables
SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')

if not SQLALCHEMY_DATABASE_URI:
    raise ValueError("No SQLALCHEMY_DATABASE_URI provided in environment variables")

# Create an engine
engine = create_engine(SQLALCHEMY_DATABASE_URI)

# Create all tables in the database
Base.metadata.create_all(engine)

# Create a configured "Session" class
Session = sessionmaker(bind=engine)

# Create a Session
session = Session()

# Optionally, you might want to check the connection
try:
    connection = engine.connect()
    print("Database connection successful")
    connection.close()
except Exception as e:
    print("Error connecting to the database:", e)
