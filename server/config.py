from flask import Flask, session, request, render_template
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from sqlalchemy_serializer import SerializerMixin as SM

db = SQLAlchemy()