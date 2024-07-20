from datetime import datetime, timezone, timedelta

from functools import wraps

from flask import Flask, request, jsonify, session
from flask_restx import Api, Resource, fields

import jwt

from .models import db, Users, JWTTokenBlocklist
from .config import BaseConfig
import requests

# from __init__ import app
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

# @app.route('/custom_route', methods=['GET'])
# def custom_route():
#     # return jsonify({'message': 'This is a custom route!'})
#     return ('hello')