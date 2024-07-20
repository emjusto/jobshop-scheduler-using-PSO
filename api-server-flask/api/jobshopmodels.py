# from datetime import datetime

# import json

# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_sqlalchemy import SQLAlchemy
# from flask import jsonify
# from .config import BaseConfig

# # db = SQLAlchemy()
# db_postgresql = SQLAlchemy()  # For PostgreSQL

from .models import db

class Employees(db.Model):
    # __bind_key__ = 'app_data'
    # __tablename__ = "employees"
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"Employee(id={self.id}, first_name={self.first_name}, last_name={self.last_name}, gender={self.gender}, role={self.role})"
    def save(self):
        db.session.add(self)
        db.session.commit()
    


# # def check_postgres_connection():
# #   """
# #   Simple route to test connection and model interaction with PostgreSQL
# #   """
# #   try:
# #     # Attempt to create a new employee (or any other database operation)
# #     new_employee = Employees(first_name="Test", last_name="User", gender="NA", role="Test")
# #     app.db_postgresql.session.add(new_employee)
# #     app.db_postgresql.session.commit()

# #     # If successful, delete the test employee
# #     app.db_postgresql.session.delete(new_employee)
# #     app.db_postgresql.session.commit()

# #     return jsonify({"message": "Connection to PostgreSQL successful!"})
# #   except Exception as e:
# #     # Handle any exceptions during database operations
# #     return jsonify({"error": str(e)}), 500  # Internal Server Error
    


# # @app.route("/check_postgres_connection")
# # def check_postgres_connection():
# #   """
# #   Simple route to test connection and model interaction with PostgreSQL
# #   """
# #   try:
# #     # Attempt to create a new employee (or any other database operation)
# #     new_employee = Employees(first_name="Test", last_name="User", gender="NA", role="Test")
# #     db_postgresql.session.add(new_employee)
# #     db_postgresql.session.commit()

# #     # If successful, delete the test employee
# #     db_postgresql.session.delete(new_employee)
# #     db_postgresql.session.commit()

# #     return jsonify({"message": "Connection to PostgreSQL successful!"})
# #   except Exception as e:
# #     # Handle any exceptions during database operations
# #     return jsonify({"error": str(e)}), 500  # Internal Server Error

