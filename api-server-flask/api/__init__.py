# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os, json

from flask import Flask, request, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine

from .routes import rest_api, token_required
from .psoroutes import *
# from .config import BaseConfig
# from .models import db
from .models import db, Users,Project,Task, Manpower, Skill, Equipment,ManpowerSkill, PSO, TaskManpower, TaskSkill, TaskEquipment
from flask_login import login_required, current_user
from .jobshopmodels import db, Employees
from flask_migrate import Migrate
from flask import jsonify
import re
import math
from math import ceil
import psycopg2
import datetime
# from datetime import datetime, timedelta, time
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)

app.config.from_object('api.config.BaseConfig')

# engine_postgresql = create_engine(app.config['SQLALCHEMY_BINDS']['app_data'])

# db_postgresql = SQLAlchemy(app)

# db.init_app(app)

# Initialize SQLite database for authentication
db.init_app(app)

# db.reflect(bind="app_data", app=app)

# Initialize PostgreSQL database for application data
# app.config['SQLALCHEMY_BINDS'] = {'app_data': 'postgresql://postgres:superpassword@localhost/jobshop'}
# db_postgresql.init_app(app)
migrate = Migrate(app, db)

rest_api.init_app(app)
CORS(app)

# Setup database
@app.before_first_request
def initialize_database():
    try:
        db.create_all()
        # db_postgresql.create_all(bind=['app_data'])
    except Exception as e:

        print('> Error: DBMS Exception: ' + str(e) )

        # fallback to SQLite
        BASE_DIR = os.path.abspath(os.path.dirname(__file__))
        app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')

        print('> Fallback to SQLite ')
        db.create_all()

"""
   Custom responses
"""

@app.after_request
def after_request(response):
    """
       Sends back a custom error with {"success", "msg"} format
    """

    if int(response.status_code) >= 400:
        response_data = json.loads(response.get_data())
        if "errors" in response_data:
            response_data = {"success": False,
                             "msg": list(response_data["errors"].items())[0][1]}
            response.set_data(json.dumps(response_data))
        response.headers.add('Content-Type', 'application/json')
    return response

@app.route('/add-skill', methods=['POST'])
def add_skill():
    try:
        data = request.json  # Get skill data from the request JSON
        if 'skillName' not in data or 'maxWorkers' not in data:
            return jsonify({'error': 'Manpower name and number of workers are required'}), 400
        
        skill_name = data.get('skillName')
        description = data.get('description')
        max_workers = data.get('maxWorkers')

        # Check if skill with the same name already exists
        existing_skill = Skill.query.filter_by(name=skill_name).first()
        if existing_skill:
            return jsonify({'error': 'Manpower already exists'})
        

        # Create a new skill instance
        new_skill = Skill(name=data['skillName'], description=data['description'], max_workers=data['maxWorkers'])
        
        # Add the new skill to the database session
        db.session.add(new_skill)
        
        # Commit the transaction
        db.session.commit()
        
        # Return a success response with the newly created skill
        return jsonify({'message': 'Manpower added successfully', 'skill': new_skill.to_dict()}), 201
    
    except SQLAlchemyError as e:
        # If an SQLAlchemy error occurs, rollback the transaction and return an error response
        db.session.rollback()
        return jsonify({'error': 'Failed to add manpower to the database', 'details': str(e)}), 500
    
    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


@app.route('/get-skills', methods=['GET'])
def get_skills():
    try:
        skills = Skill.query.all()
        # Convert SQLAlchemy objects to dictionary for JSON serialization
        skills_data = [{"id": skill.skill_id, "name": skill.name, "description": skill.description, "maxWorkers": skill.max_workers} for skill in skills]
        return jsonify(skills_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# # Update skill route
# @app.route('/update-skill/<int:id>', methods=['PUT'])
# def update_skill(id):
#     try:
#         # Get the skill data from the request body
#         data = request.json
#         # Find the skill by id
#         skill = Skill.query.get(id)
#         if skill:
#             # if Skill.query.filter(Skill.name == data['skillName']).filter(Skill.id != id).first():
#             #     return jsonify({'error': 'Skill with the same name already exists'}), 400
#             # Update the skill data
#             skill.name = data['skillName']
#             skill.description = data['description']
#             db.session.commit()
#             return jsonify({'message': 'Skill updated successfully'}), 200
#         else:
#             return jsonify({'error': 'Skill not found'}), 404
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# Update skill route
@app.route('/update-skill/<int:id>', methods=['PUT'])
def update_skill(id):
    try:
        # Get the skill data from the request body
        data = request.json
        # Find the skill by id
        skill = Skill.query.get(id)
        if skill:
            # if Skill.query.filter(Skill.name == data['skillName']).filter(Skill.id != id).first():
            #     return jsonify({'error': 'Skill with the same name already exists'}), 400
            # Update the skill data
            skill.name = data['skillName']
            skill.description = data['description']
            skill.max_workers = data['maxWorkers']
            db.session.commit()
            return jsonify({'message': 'Manpower updated successfully'}), 200
        else:
            return jsonify({'error': 'Manpower not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete skill route
@app.route('/delete-skill/<int:id>', methods=['DELETE'])
def delete_skill(id):
    try:
        # Find the skill by id
        skill = Skill.query.get(id)
        if skill:
            # Delete the skill
            db.session.delete(skill)
            db.session.commit()
            return jsonify({'message': 'Manpower deleted successfully'}), 200
        else:
            return jsonify({'error': 'Manpower not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/add-employee', methods=['POST'])
def add_employee():
    try:
        data = request.json
        if not data or 'Name' not in data or 'roles' not in data:
            return jsonify({'error': 'Name and roles are required'}), 400
        
        employee_name = data.get('Name')
        roles = data.get('roles')
        
        existing_employee = Manpower.query.filter_by(name=employee_name).first()
        if existing_employee:
            return jsonify({'error': 'Employee with the same name already exists'}), 409

        new_employee = Manpower(name=employee_name)
        db.session.add(new_employee)
        db.session.flush()

        for role_id in roles:
            manpower_skill = ManpowerSkill(manpower_id=new_employee.manpower_id, skill_id=role_id)
            db.session.add(manpower_skill)

        db.session.commit()

        return jsonify({'message': 'Employee added successfully', 'employee': new_employee.to_dict()}), 201

    except ValueError as ve:
        db.session.rollback()
        return jsonify({'error': 'Invalid data provided', 'details': str(ve)}), 400
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({'error': 'Database integrity error', 'details': str(ie)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add employee', 'details': str(e)}), 500


@app.route('/get-employees', methods=['GET'])
def get_employees():
    try:
        # Fetch all employees from the database
        employees = Manpower.query.all()

        # Check if any employees were found
        if not employees:
            return jsonify({'error': 'No manpower found'}), 404

        # Convert the list of employee objects to a list of dictionaries
        employees_data = [employee.to_dict() for employee in employees]

        # Return the list of employees as JSON response
        return jsonify(employees_data), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch employees', 'details': str(e)}), 500


#  # Update employee route
# @app.route('/update-employee/<int:id>', methods=['PUT'])
# def update_employee(id):
#     try:
#         # Get the employee data from the request body
#         data = request.json
#         # Find the employee by id
#         employee = Manpower.query.get(id)
#         if employee:
#             # Update the employee data
#             employee.name = data['Name']
#             # Assuming roles is a list of skill IDs
#             employee.skills.clear()  # Clear existing skills
#             for role_id in data['roles']:
#                 skill = Skill.query.get(role_id)
#                 if skill:
#                     employee.skills.append(skill)
#             db.session.commit()
#             return jsonify({'message': 'Employee updated successfully'}), 200
#         else:
#             return jsonify({'error': 'Employee not found'}), 404
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/update-employee/<int:id>', methods=['PUT'])
def update_employee(id):
    try:
        # Get the employee data from the request body
        data = request.json
        # Find the employee by id
        employee = Manpower.query.get(id)
        if employee:
            # Update the employee data (name)
            employee.name = data['Name']
            
            # Check if any changes are made to the employee's skills
            if 'roles' in data:
                # Clear existing skills and update with new skills
                employee.skills.clear()  # Clear existing skills
                for skill_id in data['roles']:
                    skill = Skill.query.get(skill_id)
                    if skill:
                        employee.skills.append(skill)
            
            db.session.commit()
            return jsonify({'message': 'Employee updated successfully'}), 200
        else:
            return jsonify({'error': 'Employee not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete employee route
@app.route('/delete-employee/<int:id>', methods=['DELETE'])
def delete_employee(id):
    try:
        # Find the employee by id
        employee = Manpower.query.get(id)
        if employee:
            # Delete the employee
            db.session.delete(employee)
            db.session.commit()
            return jsonify({'message': 'Employee deleted successfully'}), 200
        else:
            return jsonify({'error': 'Employee not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/add-equip', methods=['POST'])
def add_equip():
    try:
        data = request.json  # Get equip data from the request JSON
        if 'equipName' not in data or 'productivity' not in data:
            return jsonify({'error': 'Equip name and productivity are required'}), 400
        
        equip_name = data.get('equipName')
        description = data.get('description')
        productivity = data.get('productivity')
        unit = data.get('unit')

        # Check if equip with the same name already exists
        existing_equip = Equipment.query.filter_by(name=equip_name).first()
        if existing_equip:
            return jsonify({'error': 'Equipment with the same name already exists'})
        

        # Create a new equipment instance
        new_equip = Equipment(name=data['equipName'], description=data['description'], productivity=data['productivity'], unit=data['unit'])
        
        # Add the new equipment to the database session
        db.session.add(new_equip)
        
        # Commit the transaction
        db.session.commit()
        
        # Return a success response with the newly created equip
        return jsonify({'message': 'Equipment added successfully', 'equip': new_equip.to_dict()}), 201
    
    except SQLAlchemyError as e:
        # If an SQLAlchemy error occurs, rollback the transaction and return an error response
        db.session.rollback()
        return jsonify({'error': 'Failed to add equip to the database', 'details': str(e)}), 500
    
    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


@app.route('/get-equips', methods=['GET'])
def get_equips():
    try:
        equips = Equipment.query.all()
        # Convert SQLAlchemy objects to dictionary for JSON serialization
        equips_data = [{"id": equip.equip_id, "name": equip.name, "description": equip.description, "productivity": equip.productivity, "unit": equip.unit} for equip in equips]
        return jsonify(equips_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Update equip route
@app.route('/update-equip/<int:id>', methods=['PUT'])
def update_equip(id):
    try:
        # Get the equip data from the request body
        data = request.json
        # Find the equip by id
        equip = Equipment.query.get(id)
        if equip:
            # Update the equip data
            equip.name = data['equipName']
            equip.description = data['description']
            equip.productivity = data['productivity']
            equip.unit = data['unit']
            db.session.commit()
            return jsonify({'message': 'Equipment updated successfully'}), 200
        else:
            return jsonify({'error': 'Equipment not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete equip route
@app.route('/delete-equip/<int:id>', methods=['DELETE'])
def delete_equip(id):
    try:
        # Find the equip by id
        equip = Equipment.query.get(id)
        if equip:
            # Delete the equip
            db.session.delete(equip)
            db.session.commit()
            return jsonify({'message': 'Equipment deleted successfully'}), 200
        else:
            return jsonify({'error': 'Equip not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# @app.route('/tasks', methods=['GET'])
# def get_tasks():
#     tasks = Task.query.all()
#     tasks_list = []
#     for task in tasks:
#         task_dict = {
#             'TaskID': task.task_id,
#             'TaskName': task.name,
#             'StartDate': task.start_date.strftime('%Y-%m-%d') if task.start_date else None,
#             'EndDate': task.end_date.strftime('%Y-%m-%d') if task.end_date else None,
#             'Duration': task.duration,
#             'ParentId': task.parent_id,
#             'ProjectID': task.project_id,
#             'resources': [assignment.manpower_id for assignment in task.manpower_assignments],
#             'RequiredSkill': [skill.skill_id for skill in task.skills],
#         }
#         tasks_list.append(task_dict)
#     return jsonify(tasks_list)

# @app.route('/tasks', methods=['GET'])
# def get_tasks():
#     tasks = Task.query.all()
#     tasks_list = []
#     for task in tasks:
#         # Debugging: print out each task's manpower assignments
#         print(f"Task ID: {task.task_id}, Manpower Assignments: {task.manpower_assignments}")

#         # Ensure only valid manpower IDs are included
#         resources = [assignment.manpower_id for assignment in task.manpower_assignments if assignment.manpower_id is not None]
        
#         # Debugging: print out the filtered resources
#         print(f"Filtered Resources for Task ID {task.task_id}: {resources}")

#         task_dict = {
#             'TaskID': task.task_id,
#             'TaskName': task.name,
#             'StartDate': task.start_date.strftime('%Y-%m-%d') if task.start_date else None,
#             'EndDate': task.end_date.strftime('%Y-%m-%d') if task.end_date else None,
#             'Duration': task.duration,
#             'ParentId': task.parent_id,
#             'ProjectID': task.project_id,
#             'resources': resources,
#             'RequiredSkill': [skill.skill_id for skill in task.skills],
#         }
#         tasks_list.append(task_dict)
#     return jsonify(tasks_list)


#FETCH TASKS WITH productivity, predecessor
# @app.route('/tasks/<int:project_id>', methods=['GET'])
# def get_tasks(project_id):
#     tasks = Task.query.filter_by(project_id=project_id).all()
#     print(f"TASKS GET: {tasks}")
#     tasks_list = []
#     for task in tasks:
#         # Fetch dependencies for the task
#         dependencies = task.dependencies

#         # Format dependencies as "TaskID FS" string
#         dependencies_str = ', '.join([f'{dependency} FS' for dependency in dependencies]) if dependencies else None

#         # Ensure only valid manpower IDs are included
#         valid_assignments = [assignment for assignment in task.manpower_assignments if assignment and assignment.manpower_id is not None]
#         resources = [assignment.manpower_id for assignment in valid_assignments]

#         equip_assignments = [assignment for assignment in task.equipment_assignments]
#         equipment = [assignment.equip_id for assignment in equip_assignments]

#         print(f"EQUIPMENT: {equipment}")

#         # Trim the last element if it is invalid
#         if resources and (not resources[-1] or 'unit' in str(resources[-1])):
#             print(f"Trimming invalid resource: {resources[-1]}")
#             resources.pop()

#         task_dict = {
#             'TaskID': task.task_id,
#             'TaskName': task.name,
#             'StartDate': task.start_date.strftime('%Y-%m-%d') if task.start_date else None,
#             'EndDate': task.end_date.strftime('%Y-%m-%d') if task.end_date else None,
#             'Duration': task.duration,
#             'ParentId': task.parent_id,
#             'ProjectID': task.project_id,
#             'resources': resources,
#             'RequiredSkill': [skill.skill_id for skill in task.skills],
#             'Workload': task.workload,
#             'ProductivityRate': task.productivity_rate,
#             'Predecessor': dependencies_str,  # Include formatted dependencies
#             'Equipment': equipment
#         }

#         print(f"Tasks Data: {task_dict}")
#         tasks_list.append(task_dict)
#         print(f"TASKS LIST: {tasks_list}")
#     return jsonify(tasks_list)


@app.route('/tasks/<int:project_id>', methods=['GET'])
def get_tasks(project_id):
    tasks = Task.query.filter_by(project_id=project_id).all()
    print(f"TASKS GET: {tasks}")
    tasks_list = []

    for task in tasks:
        # Fetch dependencies for the task
        dependencies = task.dependencies

        # Format dependencies as "TaskID FS" string
        dependencies_str = ', '.join([f'{dependency} FS' for dependency in dependencies]) if dependencies else None

        # Ensure only valid manpower IDs are included
        valid_assignments = [assignment for assignment in task.manpower_assignments if assignment and assignment.manpower_id is not None]
        resources = [assignment.manpower_id for assignment in valid_assignments]

        # Fetch equipment assignments and their names
        equip_assignments = [assignment for assignment in task.equipment_assignments]
        equipment = [Equipment.query.get(assignment.equip_id).name for assignment in equip_assignments]

        print(f"EQUIPMENT: {equipment}")

        # Fetch skill names
        skill_names = [Skill.query.get(skill.skill_id).name for skill in task.skills]

        # Trim the last element if it is invalid
        if resources and (not resources[-1] or 'unit' in str(resources[-1])):
            print(f"Trimming invalid resource: {resources[-1]}")
            resources.pop()

        task_dict = {
            'TaskID': task.task_id,
            'TaskName': task.name,
            'StartDate': task.start_date.strftime('%Y-%m-%d') if task.start_date else None,
            'EndDate': task.end_date.strftime('%Y-%m-%d') if task.end_date else None,
            'Duration': task.duration,
            'ParentId': task.parent_id,
            'ProjectID': task.project_id,
            'resources': resources,
            'RequiredSkill': [skill.skill_id for skill in task.skills],
            'RequiredSkill': skill_names,
            'Workload': task.workload,
            'WorkloadUnit': task.unit,
            'ProductivityRate': task.productivity_rate,
            'Predecessor': dependencies_str,  # Include formatted dependencies
            'Equipment': equipment,  # Use equipment names instead of IDs,
            'AllocatedWorkers': task.allocated_workers
        }

        print(f"Tasks Data: {task_dict}")
        tasks_list.append(task_dict)
        print(f"TASKS LIST: {tasks_list}")

    return jsonify(tasks_list)

# Define the function to extract numbers from a string
def extract_number(value):
    match = re.search(r'\d+', value)
    return int(match.group(0)) if match else None

# Define the function to extract numbers from a comma-separated string
def extract_numbers_from_string(value):
    parts = value.split(',')
    return [extract_number(part.strip()) for part in parts if extract_number(part.strip()) is not None]


@app.route('/add-task', methods=['POST'])
def add_task():
    data = request.json
    try:
        dependencies_str = data.get('Predecessor')
        if dependencies_str:
            dependencies = [int(dep.strip().split('FS')[0]) for dep in dependencies_str.split(',')]
        else:
            dependencies = []

        new_task = Task(
            name=data.get('TaskName'),
            duration=data.get('Duration'),
            start_date=datetime.datetime.strptime(data.get('StartDate'), '%m/%d/%Y') if data.get('StartDate') else None,
            end_date=datetime.datetime.strptime(data.get('EndDate'), '%m/%d/%Y') if data.get('EndDate') else None,
            project_id=data.get('ProjectID'),
            parent_id=data.get('ParentId'),
            workload=float(data.get('Workload')) if data.get('Workload') else None,
            unit=data.get('WorkloadUnit'),
            productivity_rate=float(data.get('ProductivityRate')) if data.get('ProductivityRate') else None,
            dependencies=dependencies,  # Save the list of dependencies,
            allocated_workers=data.get('AllocatedWorkers')
        )

        db.session.add(new_task)
        db.session.commit()

        if 'RequiredSkill' in data:
            skill_names = data['RequiredSkill']
            skill_ids = []
            for skill_name in skill_names:
                skill = Skill.query.filter_by(name=skill_name).first()
                if skill:
                    skill_ids.append(skill.skill_id)
                else:
                    return jsonify({"error": f"Skill {skill_name} not found"}), 404

            # Add skills to task
            for skill_id in skill_ids:
                task_skill = TaskSkill(task_id=new_task.task_id, skill_id=skill_id)
                db.session.add(task_skill)

        if 'resources' in data:
            for manpower_id in data['resources']:
                task_manpower = TaskManpower(task_id=new_task.task_id, manpower_id=manpower_id)
                db.session.add(task_manpower)

        if 'Equipment' in data:
            print(f"EQUIPMENT ADDED: {data['Equipment']}")
            for equipment_name in data['Equipment']:
                equipment = Equipment.query.filter_by(name=equipment_name).first()
                if equipment:
                    task_equipment = TaskEquipment(task_id=new_task.task_id, equip_id=equipment.equip_id, start_date=new_task.start_date, end_date=new_task.end_date)
                    db.session.add(task_equipment)
                else:
                    print(f"Equipment '{equipment_name}' not found.")
        
                # Process and save the allocated workers for the task
        print(f"ALLOCATED WORKERS SERVER: {data['AllocatedWorkers']}")
        # if 'AllocatedWorkers' in data:
        #     for skill_name, num_workers in data['AllocatedWorkers']:
        #         skill = Skill.query.filter_by(name=skill_name).first()
        #         if skill:
        #             allocated_worker = AllocatedWorker(task_id=new_task.task_id, skill_id=skill.skill_id, num_workers=num_workers)
        #             db.session.add(allocated_worker)
        #         else:
        #             return jsonify({"error": f"Skill {skill_name} not found"}), 404

        db.session.commit()

        return jsonify({'message': 'Task added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    

@app.route('/delete-task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    try:
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

# @app.route('/update-task/<int:task_id>', methods=['PUT'])
# def update_task(task_id):
#     task = Task.query.get(task_id)
#     if not task:
#         return jsonify({"error": "Task not found"}), 404

#     try:
#         data = request.json
#         # Update task attributes with new data
#         task.name = data.get('TaskName', task.name)
#         task.duration = data.get('Duration', task.duration)
#         task.start_date = datetime.strptime(data.get('StartDate'), '%m/%d/%Y') if data.get('StartDate') else None
#         task.end_date = datetime.strptime(data.get('EndDate'), '%m/%d/%Y') if data.get('EndDate') else None
#         task.project_id = data.get('ProjectID', task.project_id)
#         task.parent_id = data.get('ParentId', task.parent_id)

       

#         # Update related records if necessary (e.g., skills, manpower)
#         if 'RequiredSkill' in data:
#             task.skills = [Skill.query.get(skill_id) for skill_id in data['RequiredSkill']]

#         if 'resources' in data:
#             task.manpower_assignments = [TaskManpower(task_id=task.task_id, manpower_id=manpower_id) for manpower_id in data['resources']]

#         print(f"TASK ID: {task.task_id} - SKILLS: {task.skills} - Manpower: {task.manpower_assignments}")
#         db.session.commit()
#         return jsonify({'message': 'Task updated successfully'}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500

# @app.route('/update-task/<int:task_id>', methods=['PUT'])
# def update_task(task_id):
#     task = Task.query.get(task_id)
#     if not task:
#         return jsonify({"error": "Task not found"}), 404

#     try:
#         data = request.json

#         # Logging the incoming data for update
#         print(f"Updating Task ID: {task_id} with data: {data}")

#         # Update task attributes with new data
#         task.name = data.get('TaskName', task.name)
#         task.duration = data.get('Duration', task.duration)
#         task.start_date = datetime.strptime(data.get('StartDate'), '%m/%d/%Y') if data.get('StartDate') else None
#         task.end_date = datetime.strptime(data.get('EndDate'), '%m/%d/%Y') if data.get('EndDate') else None
#         task.project_id = data.get('ProjectID', task.project_id)
#         task.parent_id = data.get('ParentId', task.parent_id)

#         # Update related records if necessary (e.g., skills, manpower)
#         if 'RequiredSkill' in data:
#             task.skills = [Skill.query.get(skill_id) for skill_id in data['RequiredSkill']]

#         if 'resources' in data:
#             # Clear existing manpower assignments
#             TaskManpower.query.filter_by(task_id=task.task_id).delete()
#             db.session.flush()  # Ensure deletions are flushed to the database
            
#             # Add new manpower assignments
#             for manpower_id in data['resources']:
#                 if manpower_id is not None:  # Ensure no undefined values are included
#                     task_manpower = TaskManpower(task_id=task.task_id, manpower_id=manpower_id)  # Set unit to a default value
#                     db.session.add(task_manpower)

#         db.session.commit()

#         # Logging the updated state
#         updated_task = Task.query.get(task_id)
#         print(f"Updated Task ID: {task_id} - SKILLS: {[skill.skill_id for skill in updated_task.skills]} - Manpower: {[assignment.manpower_id for assignment in updated_task.manpower_assignments]}")

#         return jsonify({'message': 'Task updated successfully'}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500
    
# @app.route('/update-task/<int:task_id>', methods=['PUT'])
# def update_task(task_id):
#     task = Task.query.get(task_id)
#     if not task:
#         return jsonify({"error": "Task not found"}), 404

#     try:
#         data = request.json
#         # Update task attributes with new data
#         task.name = data.get('TaskName', task.name)
#         task.duration = data.get('Duration', task.duration)
#         task.start_date = datetime.strptime(data.get('StartDate'), '%m/%d/%Y') if data.get('StartDate') else task.start_date
#         task.end_date = datetime.strptime(data.get('EndDate'), '%m/%d/%Y') if data.get('EndDate') else task.end_date
#         task.project_id = data.get('ProjectID', task.project_id)
#         task.parent_id = data.get('ParentId', task.parent_id)
#         task.workload=float(data.get('Workload')) if data.get('Workload') else task.workload,  # Convert to float
#         task.productivity_rate=float(data.get('ProductivityRate')) if data.get('ProductivityRate') else task.productivity_rate  # Convert to float

#         # Update dependencies
#         dependencies_str = data.get('Predecessor')
#         if dependencies_str:
#             task.dependencies = [int(dep.strip().split('FS')[0]) for dep in dependencies_str.split(',')]
#         else:
#             task.dependencies = []

#         # # Update related records if necessary (e.g., skills, manpower)
#         # if 'RequiredSkill' in data:
#         #     task.skills = [Skill.query.get(skill_id) for skill_id in data['RequiredSkill']]
        
#         # Convert skill names to IDs and update related records if necessary
#         if 'RequiredSkill' in data:
#             skill_names = data['RequiredSkill']
#             skill_ids = []
#             for skill_name in skill_names:
#                 skill = Skill.query.filter_by(name=skill_name).first()
#                 if skill:
#                     skill_ids.append(skill.skill_id)
#                 else:
#                     return jsonify({"error": f"Skill {skill_name} not found"}), 404
#             task.skills = [Skill.query.get(skill_id) for skill_id in skill_ids]
            

#         if 'resources' in data:
#             # Clear existing manpower assignments and add new ones
#             TaskManpower.query.filter_by(task_id=task_id).delete()
#             for manpower_id in data['resources']:
#                 task_manpower = TaskManpower(task_id=task_id, manpower_id=manpower_id)
#                 db.session.add(task_manpower)
        
#         # if 'Equipment' in data:
#         #     # Clear existing manpower assignments and add new ones
#         #     TaskEquipment.query.filter_by(task_id=task_id).delete()
#         #     task_manpower = TaskManpower(task_id=task_id, manpower_id=data['Equipment'], start_date=task.start_date, end_date=task.end_date)
#         #     db.session.add(task_manpower)
#         # if 'Equipment' in data:
#         #     # Clear existing equipment assignments for the task
#         #     TaskEquipment.query.filter_by(task_id=task_id).delete()
#         #     equipment = Equipment.query.filter_by(name=data['Equipment']).first()
#         #     if equipment:
#         #             # If equipment is found, create a new TaskEquipment instance
#         #         task_equipment = TaskEquipment(task_id=task_id, equip_id=equipment.equip_id, start_date=task.start_date, end_date=task.end_date)
#         #         db.session.add(task_equipment)
#         #     else:
#         #         # If equipment is not found, you may choose to handle this case according to your application's logic
#         #         # For example, logging a warning or skipping this equipment assignment
#         #         return jsonify({"error": f"Equipment {data['Equipment']} not found"}), 404
#         # if 'Equipment' in data:
#         #         # Clear existing equipment assignments for the task
#         #         TaskEquipment.query.filter_by(task_id=task_id).delete()
                
#         #         # Process the equipment name and convert it to ID
#         #         equipment_name = data['Equipment']
#         #         print(f"EQUIP NAME {equipment_name}")
#         #         equipment = Equipment.query.filter_by(name=equipment_name).first()
#         #         if equipment:
#         #             # Create a new task equipment assignment
#         #             task_equipment = TaskEquipment(task_id=task_id, equip_id=equipment.equip_id, start_date=task.start_date, end_date=task.end_date)
#         #             db.session.add(task_equipment)
#         #         else:
#         #             print(f"Equipment '{equipment_name}' not found.")
#         # else:
#         #     print(F"NO EQUIP NAME UPDATED")
#         # if 'Equipment' in data:
#         #     # Clear existing equipment assignments for the task
#         #     TaskEquipment.query.filter_by(task_id=task_id).delete()
            
#         #     # Iterate over each equipment name in the provided data
#         #     for equipment_name in data['Equipment']:
#         #         # Look up the equipment ID based on the equipment name
#         #         equipment = Equipment.query.filter_by(name=equipment_name).first()
#         #         if equipment:
#         #             # If equipment is found, create a new TaskEquipment instance
#         #             task_equipment = TaskEquipment(task_id=task_id, equip_id=equipment.equip_id, start_date=task.start_date, end_date=task.end_date)
#         #             db.session.add(task_equipment)
#         #         else:
#         #             # If equipment is not found, you may choose to handle this case according to your application's logic
#         #             # For example, logging a warning or skipping this equipment assignment
#         #             print(f"Equipment '{equipment_name}' not found.")
#         if 'Equipment' in data:
#             print(f"EQUIPMENT ASSIGNED: {data['Equipment']}")
#             # Clear existing equipment assignments for the task
#             TaskEquipment.query.filter_by(task_id=task_id).delete()
            
#             # Check if Equipment data is a single name or an array
#             if isinstance(data['Equipment'], str):
#                 # If it's a single name, convert it to a list for uniform handling
#                 equipment_names = [data['Equipment']]
#             elif isinstance(data['Equipment'], list):
#                 # If it's already a list, use it as is
#                 equipment_names = data['Equipment']
#             else:
#                 # Handle other cases or raise an error as needed
#                 return jsonify({"error": "Invalid Equipment data format"}), 400

#             # Iterate over each equipment name
#             for equipment_name in equipment_names:
#                 # Look up the equipment ID based on the equipment name
#                 equipment = Equipment.query.filter_by(name=equipment_name).first()
#                 if equipment:
#                     # If equipment is found, create a new TaskEquipment instance
#                     task_equipment = TaskEquipment(task_id=task_id, equip_id=equipment.equip_id, start_date=task.start_date, end_date=task.end_date)
#                     db.session.add(task_equipment)
#                 else:
#                     # If equipment is not found, handle this case according to your application's logic
#                     print(f"Equipment '{equipment_name}' not found.")
        

#         db.session.commit()
#         return jsonify({'message': 'Task updated successfully'}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500  

@app.route('/update-task/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    try:
        data = request.json
        # Update task attributes with new data
        task.name = data.get('TaskName', task.name)
        task.duration = data.get('Duration', task.duration)
        task.start_date = datetime.datetime.strptime(data.get('StartDate'), '%m/%d/%Y') if data.get('StartDate') else task.start_date
        task.end_date = datetime.datetime.strptime(data.get('EndDate'), '%m/%d/%Y') if data.get('EndDate') else task.end_date
        task.project_id = data.get('ProjectID', task.project_id)
        task.parent_id = data.get('ParentId', task.parent_id)
        task.unit= data.get('WorkloadUnit', task.unit)
        task.workload = float(data.get('Workload')) if data.get('Workload') else task.workload
        task.productivity_rate = float(data.get('ProductivityRate')) if data.get('ProductivityRate') else task.productivity_rate,
        task.allocated_workers = data.get('AllocatedWorkers', task.allocated_workers)

        # Update dependencies
        dependencies_str = data.get('Predecessor')
        if dependencies_str:
            try:
                task.dependencies = [int(dep.strip().split('FS')[0]) for dep in dependencies_str.split(',')]
            except ValueError:
                return jsonify({"error": "Invalid dependency format"}), 400
        else:
            task.dependencies = []

        # Convert skill names to IDs and update related records if necessary
        if 'RequiredSkill' in data:
            skill_names = data['RequiredSkill']
            skill_ids = []
            for skill_name in skill_names:
                skill = Skill.query.filter_by(name=skill_name).first()
                if skill:
                    skill_ids.append(skill.skill_id)
                else:
                    return jsonify({"error": f"Skill {skill_name} not found"}), 404
            task.skills = [Skill.query.get(skill_id) for skill_id in skill_ids]

        if 'resources' in data:
            # Clear existing manpower assignments and add new ones
            TaskManpower.query.filter_by(task_id=task_id).delete()
            for manpower_id in data['resources']:
                if manpower_id:
                    task_manpower = TaskManpower(task_id=task_id, manpower_id=manpower_id)
                    db.session.add(task_manpower)
                else:
                    return jsonify({"error": "Invalid manpower ID"}), 400

        # if 'Equipment' in data:
        #     print(f"EQUIPMENT ASSIGNED: {data['Equipment']}")
        #     # Clear existing equipment assignments for the task
        #     TaskEquipment.query.filter_by(task_id=task_id).delete()
            
        #     # Check if Equipment data is a single name or an array
        #     if isinstance(data['Equipment'], str):
        #         # If it's a single name, convert it to a list for uniform handling
        #         equipment_names = [data['Equipment']]
        #     elif isinstance(data['Equipment'], list):
        #         # If it's already a list, use it as is
        #         equipment_names = data['Equipment']
        #     else:
        #         # Handle other cases or raise an error as needed
        #         return jsonify({"error": "Invalid Equipment data format"}), 400

        #     # Iterate over each equipment name
        #     for equipment_name in equipment_names:
        #         # Look up the equipment ID based on the equipment name
        #         equipment = Equipment.query.filter_by(name=equipment_name).first()
        #         if equipment:
        #             # If equipment is found, create a new TaskEquipment instance
        #             task_equipment = TaskEquipment(task_id=task_id, equip_id=equipment.equip_id, start_date=task.start_date, end_date=task.end_date)
        #             db.session.add(task_equipment)
        #         else:
        #             # If equipment is not found, handle this case according to your application's logic
        #             print(f"Equipment '{equipment_name}' not found.")
        #             return jsonify({"error": f"Equipment '{equipment_name}' not found"}), 404

        if 'Equipment' in data:
            print(f"EQUIPMENT ASSIGNED: {data['Equipment']}")
            # Clear existing equipment assignments for the task
            TaskEquipment.query.filter_by(task_id=task_id).delete()

            # Check if Equipment data is a single name or an array
            if isinstance(data['Equipment'], str):
                # If it's a single name, convert it to a list for uniform handling
                equipment_names = [data['Equipment']]
            elif isinstance(data['Equipment'], list):
                # If it's already a list, use it as is
                equipment_names = data['Equipment']
            else:
                # Handle other cases or raise an error as needed
                return jsonify({"error": "Invalid Equipment data format"}), 400

            # Iterate over each equipment name
            for equipment_name in equipment_names:
                # Look up the equipment ID based on the equipment name
                equipment = Equipment.query.filter_by(name=equipment_name).first()
                if equipment:
                    # If equipment is found, create a new TaskEquipment instance
                    task_equipment = TaskEquipment(task_id=task_id, equip_id=equipment.equip_id, start_date=task.start_date, end_date=task.end_date)
                    db.session.add(task_equipment)
                else:
                    # If equipment is not found, handle this case according to your application's logic
                    return jsonify({"error": f"Equipment '{equipment_name}' not found"}), 404

        db.session.commit()
        return jsonify({'message': 'Task updated successfully'}), 200

    except ValueError as ve:
        db.session.rollback()
        return jsonify({'error': f'Value error: {str(ve)}'}), 400
    except TypeError as te:
        db.session.rollback()
        return jsonify({'error': f'Type error: {str(te)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500



# @app.route('/save-project', methods=['POST'])
# def save_project():
#     data = request.get_json()
#     project = Project(
#         name=data['name'],
#         location=data['location'],
#         duration=data['duration'],
#         manager_id=data['manager'],
#         start_date=data['start_date'],
#         end_date=data['end_date']
#     )
#     db.session.add(project)
#     db.session.commit()

#     for task_data in data['tasks']:
#         task = Task(
#             name=task_data['TaskName'],
#             duration=task_data['Duration'],
#             start_date=task_data['StartDate'],
#             end_date=task_data['EndDate'],
#             project_id=project.project_id,
#             parent_id=task_data['ParentId'],
#             required_skill=task_data['RequiredSkill'],
#             resources=task_data['resources']
#         )
#         db.session.add(task)

#     db.session.commit()
#     return jsonify({"message": "Project and tasks saved successfully!"}), 201  

@app.route('/save-project', methods=['POST'])
def save_project():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'location', 'duration', 'manager_id', 'start_date', 'end_date', 'tasks']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Check if all tasks exist
        task_ids = []
        for task_data in data['tasks']:
            task_id = task_data['TaskID']
            print(f"TASK ID: {task_id}")
            task = Task.query.get(task_id)
            if task is None:
                return jsonify({"error": f"Task with ID {task_id} does not exist"}), 400
            task_ids.append(task_id)
            print(f"TASKS IDS: {task_ids}")

        # Create and save the project
        project = Project(
            name=data['name'],
            location=data['location'],
            duration=data['duration'],
            manager_id=data['manager_id'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            task_ids=",".join(map(str, task_ids))  # Convert list of task IDs to comma-separated string
        )
        db.session.add(project)
        db.session.commit()

        return jsonify({"message": "Project and tasks saved successfully!","project_id": project.project_id}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "message": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": "Key error", "message": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "message": str(e)}), 500

@app.route('/project/<int:project_id>', methods=['GET'])
def get_project(project_id):
    try:
        project = Project.query.get(project_id)
        if project is None:
            return jsonify({"error": "Project not found"}), 404

        # Extract task IDs and fetch tasks
        #task_ids = project.task_ids.split(',')
        #tasks = Task.query.filter(Task.task_id.in_(task_ids)).all()
        
        project_data = {
            "project_id": project.project_id,
            "name": project.name,
            "location": project.location,
            "duration": project.duration,
            "manager_id": project.manager_id,
            "start_date": project.start_date.strftime('%Y-%m-%d'),
            "end_date": project.end_date.strftime('%Y-%m-%d'),

            
           # "tasks": [task.to_dict() for task in tasks]  # Assuming you have a method to_dict() in Task model
           # "tasks": task_ids
        }
        print(f"PROJECT DATA: {project_data}")

        return jsonify(project_data), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "message": str(e)}), 500

#UPDATE PROJECT

@app.route('/update-project/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'location', 'duration', 'manager_id', 'start_date', 'end_date', 'tasks']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Check if the project exists
        project = Project.query.get(project_id)
        if project is None:
            return jsonify({"error": "Project not found"}), 404

        # Check if all tasks exist
        task_ids = []
        for task_data in data['tasks']:
            task_id = task_data['TaskID']
            task = Task.query.get(task_id)
            if task is None:
                return jsonify({"error": f"Task with ID {task_id} does not exist"}), 400
            task_ids.append(task_id)

        # Update the project
        project.name = data['name']
        project.location = data['location']
        project.duration = data['duration']
        project.manager_id = data['manager_id']
        project.start_date = data['start_date']
        project.end_date = data['end_date']
        project.task_ids = ",".join(map(str, task_ids))  # Convert list of task IDs to comma-separated string

        db.session.commit()

        return jsonify({"message": "Project updated successfully!"}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "message": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": "Key error", "message": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "message": str(e)}), 500
    
# @app.route('/delete-project/<int:project_id>', methods=['DELETE'])
# def delete_project(project_id):
#     try:
#         project = Project.query.get(project_id)
#         if project is None:
#             return jsonify({"error": "Project not found"}), 404

#         db.session.delete(project)
#         db.session.commit()
#         return jsonify({"message": "Project deleted successfully"}), 200

#     except SQLAlchemyError as e:
#         db.session.rollback()
#         return jsonify({"error": "Database error", "message": str(e)}), 500
#     except Exception as e:
#         return jsonify({"error": "An unexpected error occurred", "message": str(e)}), 500

import logging

@app.route('/delete-project/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404

        # Delete related tasks if necessary
        tasks = Task.query.filter_by(project_id=project_id).all()
        for task in tasks:
            db.session.delete(task)

        # Delete the project
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Project deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting project {project_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/projects', methods=['GET'])
def get_projects():
    try:
        projects = Project.query.all()
        projects_data = [
            {
                "id": project.project_id,
                "name": project.name,
                "start_date": project.start_date,
                "duration": project.duration,
                "end_date": project.end_date,
                "location": project.location,
                "manager_id": project.manager_id,
                "task_ids": project.task_ids.split(',') if project.task_ids else [],
            }
            for project in projects
        ]
        return jsonify(projects_data), 200

    except SQLAlchemyError as e:
        return jsonify({"error": "Database error", "message": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "message": str(e)}), 500
# @app.route("/add_employee", methods=["POST"])
# def add_employee():
#     """
#     Route to create a new employee in the PostgreSQL database.
#     Expects JSON data containing employee details in the request body.
#     """
#     try:
#         # Get employee data from request body (adjust as needed)
#         data = request.get_json()

#         if not data:
#             return jsonify({"error": "Missing employee data in request body"}), 400  # Bad Request

#         # Extract employee data from JSON
#         first_name = data.get("first_name")
#         last_name = data.get("last_name")
#         gender = data.get("gender")
#         role = data.get("role")

#         # Validate data (optional, implement validation logic here)
#         if not all([first_name, last_name, gender, role]):
#             return jsonify({"error": "Missing required employee details"}), 400  # Bad Request

#         # Create a new employee object
#         new_employee = Employees(
#             first_name=first_name, last_name=last_name, gender=gender, role=role
#         )

#         # Add and commit employee to database
#         # db_postgresql.session.add(new_employee)
#         # db_postgresql.session.commit()
#         Employees.save(new_employee)

#         # Return success message with the ID of the created employee
#         return jsonify({"message": "Employee created successfully!", "id": new_employee.id}), 201  # Created

#     except Exception as e:
#         # Handle any exceptions during database operations
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500  # Internal Server Error


from datetime import datetime, timedelta

# @app.route('/compute_project_duration/<int:project_id>', methods=['GET'])
# def compute_project_duration(project_id):
#     tasks = Task.query.filter_by(project_id=project_id).all()
#     skills = Skill.query.all()
#     equips = Equipment.query.all()

#     # Helper function to format dates
#     def format_date(date_obj):
#         return date_obj.strftime("%a %b %d %Y %H:%M:%S")

#     def calculate_duration(task, skills):
#         if not task.skills:
#             return 0, 0  # Return default values if no skills are associated with the task

#         total_hours_needed = task.workload / task.productivity_rate
#         max_workers = min([skill.max_workers for skill in task.skills])
#         duration_hours = ceil(total_hours_needed / max_workers)
#         duration_days = ceil(duration_hours / 8)
#         return duration_hours, max_workers

#     # Calculate durations and allocate workers
#     for task in tasks:
#         allocated_workers = []
#         duration_hours, max_workers = calculate_duration(task, skills)
#         task.duration = duration_hours
#         for skill in task.skills:
#             workers_needed = ceil(task.workload / (task.productivity_rate * 8 * (task.duration / 8)))
#             actual_workers_needed = min(workers_needed, skill.max_workers)
#             allocated_worker = AllocatedWorker(task_id=task.task_id, skill_id=skill.skill_id, num_workers=actual_workers_needed)
#             allocated_workers.append(allocated_worker)
#         task.allocated_workers = allocated_workers

#     # Update start and end dates based on dependencies
#     start_date = tasks[0].start_date

#     for task in tasks:
#         if task.dependencies:
#             dependency_end_dates = [
#                 Task.query.get(dep_id).end_date for dep_id in task.dependencies
#             ]
#             start_date = max(dependency_end_dates) + timedelta(days=1)

#         end_date = start_date + timedelta(hours=task.duration - 1)
#         # end_date = end_date.replace(hour=17, minute=0)
        
#         task.start_date = format_date(start_date)
#         task.end_date = format_date(end_date)
        
#         start_date = end_date + timedelta(days=1)

#     # Calculate total project duration
#     project_start = tasks[0].start_date
#     project_end = tasks[-1].end_date
#     total_duration_days = (project_end - project_start).days + 1

#     # Output updated tasks data
#     return jsonify({
#         "tasks": [task.serialize() for task in tasks],
#         "total_project_duration": total_duration_days
#     })

# @app.route('/compute_project_duration/<int:project_id>', methods=['GET'])
# def compute_project_duration(project_id):
#     tasks = Task.query.filter_by(project_id=project_id).all()
#     skills = Skill.query.all()
#     equips = Equipment.query.all()

#     # Helper function to format dates
#     def format_date(date_obj):
#         return date_obj.strftime("%a %b %d %Y %H:%M:%S")

#     # Helper function to convert dates to datetime objects
#     def convert_to_datetime(date):
#         if isinstance(date, str):
#             return datetime.strptime(date, "%Y-%m-%d")
#         return date

#     def calculate_duration(task, skills):
#         if not task.skills:
#             return 0, 0  # Return default values if no skills are associated with the task

#         total_hours_needed = task.workload / task.productivity_rate
#         max_workers = min([skill.max_workers for skill in task.skills])
#         duration_hours = ceil(total_hours_needed / max_workers)
#         duration_days = ceil(duration_hours / 8)
#         return duration_hours, max_workers

#     # Calculate durations and allocate workers
#     for task in tasks:
#         allocated_workers = []
#         duration_hours, max_workers = calculate_duration(task, skills)
#         task.duration = duration_hours
#         for skill in task.skills:
#             workers_needed = ceil(task.workload / (task.productivity_rate * 8 * (task.duration / 8)))
#             actual_workers_needed = min(workers_needed, skill.max_workers)
#             allocated_worker = AllocatedWorker(task_id=task.task_id, skill_id=skill.skill_id, num_workers=actual_workers_needed)
#             allocated_workers.append(allocated_worker)
#         task.allocated_workers = allocated_workers

#     # Update start and end dates based on dependencies
#     start_date = convert_to_datetime(tasks[0].start_date)

#     for task in tasks:
#         if task.dependencies:
#             dependency_end_dates = [
#                 convert_to_datetime(Task.query.get(dep_id).end_date) for dep_id in task.dependencies
#             ]
#             start_date = max(dependency_end_dates) + timedelta(days=1)

#         end_date = start_date + timedelta(hours=task.duration - 1)
#         # end_date = end_date.replace(hour=17, minute=0)
        
#         task.start_date = format_date(start_date)
#         task.end_date = format_date(end_date)
        
#         start_date = end_date + timedelta(days=1)

#     # Calculate total project duration
#     project_start = convert_to_datetime(tasks[0].start_date)
#     project_end = convert_to_datetime(tasks[-1].end_date)
#     total_duration_days = (project_end - project_start).days + 1

#     # Output updated tasks data
#     return jsonify({
#         "tasks": [task.serialize() for task in tasks],
#         "total_project_duration": total_duration_days
#     })



# @app.route('/calculate_project_duration/<int:project_id>', methods=['GET'])
# def calculate_project_duration(project_id):
#     # Replace with database queries to get roles_data, equipment_data, and tasks
#     tasks = Task.query.filter_by(project_id=project_id).all()
#     skills_data = Skill.query.all()
#     equips = Equipment.query.all()

#     print(f"SKIILS DATA: {skills_data}")
#     print(f"EQUIPMENT DATA: {equips}")

#     def calculate_duration(task, skills_data):
#         total_hours_needed = task.workload / task.productivity_rate
#         max_workers = min([skills_data[skill.skill_id].max_workers for skill in task.skills])
#         duration_hours = ceil(total_hours_needed / max_workers)
#         duration_days = ceil(duration_hours / 8)
#         return duration_hours, max_workers

#     # Calculate durations and allocate workers
#     for task in tasks:
#         allocated_workers = []
#         duration_hours, max_workers = calculate_duration(task, skills_data)
#         task.duration = duration_hours
#         for skill in task.skills:
#             workers_needed = ceil(task.workload / (task.productivity_rate * 8 * (task.duration / 8)))
#             actual_workers_needed = min(workers_needed, skill.max_workers)
#             allocated_worker = AllocatedWorker(task_id=task.task_id, skill_id=skill.skill_id, num_workers=actual_workers_needed)
#             allocated_workers.append(allocated_worker)
#         task.allocated_workers = allocated_workers

#     # Update start and end dates based on dependencies
#     start_date = tasks[0].start_date

#     for task in tasks:
#         if task.dependencies:
#             dependency_end_dates = [
#                 Task.query.get(dep_id).end_date for dep_id in task.dependencies
#             ]
#             start_date = max(dependency_end_dates) + timedelta(days=1)

#         task.start_date = start_date
#         end_date = start_date + timedelta(hours=task.duration - 1)
#         end_date = end_date.replace(hour=17, minute=0)
#         task.end_date= end_date
#         start_date = end_date + timedelta(days=1)

#     # Calculate total project duration
#     project_start = tasks[0].start_date
#     project_end = tasks[-1].end_date
#     total_duration_days = (project_end - project_start).days + 1

#     # Output updated tasks data
#     for task in tasks:
#         task.start_date = task.start_date.strftime("%Y-%m-%d")
#         task.end_date = task.end_date.strftime("%Y-%m-%d")

#     return jsonify({
#         "tasks": tasks,
#         "total_project_duration": total_duration_days
#     })

# from datetime import datetime, timedelta, time, date
import datetime
from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
import math

# @app.route('/calculate_project_duration/<int:project_id>', methods=['GET'])
# def calculate_project_duration(project_id):
#     try:
#         tasks = Task.query.filter_by(project_id=project_id).all()
#         skills_data = {skill.skill_id: skill for skill in Skill.query.all()}  # Convert to dictionary for quick lookup
#         equips = {equip.equip_id: equip for equip in Equipment.query.all()}  # Convert to dictionary for quick lookup
#         print(f"TASKS DATA: {tasks}")
#         print(f"SKILLS DATA: {skills_data}")
#         print(f"EQUIPMENT DATA: {equips}")

#         def calculate_duration(task, skills_data):
#             total_hours_needed = task.workload / task.productivity_rate
#             max_workers_list = [
#                 skills_data[skill.skill_id].max_workers 
#                 for skill in task.skills 
#                 if skill.skill_id in skills_data
#             ]

#             # # Consider equipment productivity
#             # for equip_id in task.equipment_assignments:
#             #     print(f"EQUIP_ID: {equip_id}")
#             #     if equip_id in equips:
#             #         total_hours_needed /= equips[equip_id].productivity
#             #         print(f"TOTAL HOURS NEEDED: {total_hours_needed}")
#             #     else:
#             #         print(f"NO TOTAL HOURS NEEDED: ")
#                         # Consider equipment productivity
#             for equip in task.equipment_assignments:
#                 print(f"EQUIP_ID: {equip.equip_id}")
#                 if equip.equip_id in equips:
#                     total_hours_needed /= equips[equip.equip_id].productivity
#                     print(f"TOTAL HOURS NEEDED: {total_hours_needed}")
#                 else:
#                     print(f"NO TOTAL HOURS NEEDED: ")

#             print(f"MAX_WORKERS: {max_workers_list}")
#             if not max_workers_list:
#                 raise ValueError(f"No valid skills found for task {task.task_id}")
#             max_workers = min(max_workers_list)
#             duration_hours = math.ceil(total_hours_needed / max_workers)
#             duration_days = math.ceil(duration_hours / 8)
#             return duration_hours, max_workers

#         # Convert date to datetime
#         def to_datetime(date_obj):
#             if isinstance(date_obj, datetime.datetime):
#                 print(f"DATE OBJECT: {date_obj}")
#                 return date_obj
#             elif isinstance(date_obj, datetime.date):
#                 print(f"DATETIME OBJECTNOT: {date_obj}")
#                 return datetime.datetime.combine(date_obj, datetime.time.min)
#             raise TypeError(f"Expected datetime or date object, got {type(date_obj)}")

#         # Calculate durations and allocate workers
#         for task in tasks:
#             allocated_workers = []
#             try:
#                 duration_hours, max_workers = calculate_duration(task, skills_data)
#             except ValueError as e:
#                 return jsonify({"error": str(e)}), 400

#             task.duration = duration_hours
#             for skill in task.skills:
#                 if skill.skill_id in skills_data:
#                     workers_needed = math.ceil(task.workload / (task.productivity_rate * 8 * (task.duration / 8)))
#                     actual_workers_needed = min(workers_needed, skills_data[skill.skill_id].max_workers)
#                     allocated_worker = AllocatedWorker(task_id=task.task_id, skill_id=skill.skill_id, num_workers=actual_workers_needed)
#                     allocated_workers.append(allocated_worker)
#             task.allocated_workers = allocated_workers

#             print(f"ALLOCATED WORKERS: {allocated_workers}")

#             print(f"TASK DEPENDENCIES: {task.dependencies}")

#         if isinstance(tasks[0].start_date, datetime.date):
#                 print(f"DATETIME OBJECTNOT: {tasks[0].start_date}")
#         else:
#             print("TATAE:")
#         # print(f"START DATE CONVERTED: {tasks[0].start_date}")
#         # Update start and end dates based on dependencies
#         start_date = to_datetime(tasks[0].start_date)
        

#         for task in tasks:
#             if task.dependencies:
#                 print(f"Task dependencies: {task.dependencies}, Type: {type(task.dependencies)}")
#                 dependency_end_dates = []
#                 for dep_id in task.dependencies:
#                     dep_task = Task.query.get(dep_id)
#                     if dep_task:
#                         dep_end_date = to_datetime(dep_task.end_date)
#                         dependency_end_dates.append(dep_end_date)
#                     else:
#                         print(f"Task with ID {dep_id} not found.")
#                 start_date = max(dependency_end_dates, default=start_date) + timedelta(days=1)

#             task.start_date = start_date
#             end_date = start_date + timedelta(hours=task.duration - 1)
#             task.end_date = end_date
#             start_date = end_date + timedelta(days=1)

#         # Calculate total project duration
#         project_start = to_datetime(tasks[0].start_date)
#         project_end = to_datetime(tasks[-1].end_date)
#         total_duration_days = (project_end - project_start).days + 1

#         print(f"PROJECT END: {project_end} - PROJECT START: {project_start} ")

#         # Output updated tasks data
#         tasks_data = []
#         for task in tasks:
#             task_data = {
#                 "task_id": task.task_id,
#                 "name": task.name,
#                 "workload": task.workload,
#                 "productivity_rate": task.productivity_rate,
#                 "start_date": task.start_date.strftime("%Y-%m-%d"),
#                 "end_date": task.end_date.strftime("%Y-%m-%d"),
#                 "duration": task.duration,
#                 "allocated_workers": [
#                     {
#                         "task_id": worker.task_id,
#                         "skill_id": worker.skill_id,
#                         "num_workers": worker.num_workers
#                     } for worker in task.allocated_workers
#                 ]
#             }
#             tasks_data.append(task_data)

#         return jsonify({
#             "tasks": tasks_data,
#             "total_project_duration": total_duration_days
#         })

#     except SQLAlchemyError as e:
#         print(f"Database error: {str(e)}")
#         return jsonify({"error": "Database error occurred"}), 500
#     except Exception as e:
#         print(f"Error calculating project duration: {str(e)}")
#         return jsonify({"error": f"An error occurred while calculating project duration: {str(e)}"}), 500

import numpy as np


#WORKING ALGO 
# @app.route('/optimize-tasks/<int:project_id>', methods=['POST', 'GET'])
# def optimize_tasks(project_id):
#     try:
#         # Fetch tasks, skills, and equipment from the database
#         tasks = Task.query.filter_by(project_id=project_id).all()
#         skills_data = {skill.skill_id: skill for skill in Skill.query.all()}
#         equipment_data = {equip.equip_id: equip for equip in Equipment.query.all()}

#         if not tasks:
#             return jsonify({"error": "No tasks found for the given project ID"}), 404

#         # Example data for roles and equipment from the request body (if POST)
#         roles_data = {}
#         if request.method == 'POST':
#             data = request.json
#             roles_data = data.get('roles', {})
#             equipment_data = data.get('equipment', {})

#         # Extract maximum workers per role from the roles data
#         max_workers_per_role = {role_id: skill.max_workers for role_id, skill in skills_data.items()}
#         max_workers = sum(max_workers_per_role.values())
#         remaining_workers = {role_id: skill.max_workers for role_id, skill in skills_data.items()}

#         num_particles = 30
#         num_iterations = 100
#         w = 0.5
#         c1 = 1.0
#         c2 = 1.0
#         hours_per_day = 8

#         # Define the objective function (minimize project duration with penalty for exceeding max workers)
#         def objective_function(workers_allocation):
#             total_duration = 0
#             penalty = 0

#             for task, workers in zip(tasks, workers_allocation):
#                 if workers <= 0:
#                     workers = 1  # Ensure at least one worker per task

#                 # Calculate task duration with equipment productivity rate
#                 try:
#                     equipment_productivity_multiplier = np.prod(
#                         [1 + equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments])
#                 except AttributeError as e:
#                     print(f"Error with task equipment assignments: {e}")
#                     return float('inf')  # Return a large value to penalize incorrect configurations

#                 task_duration = (task.workload / (equipment_productivity_multiplier * workers * task.productivity_rate)) / hours_per_day
#                 total_duration += task_duration

#                 # Check for role deficiencies and calculate penalty
#                 for role in task.skills:
#                     role_id = role.skill_id  # Ensure this is correctly referencing skill_id
#                     if remaining_workers[role_id] < workers:
#                         penalty += workers - remaining_workers[role_id]

#             # Calculate total score (project duration + penalty)
#             total_score = total_duration + penalty
#             return total_score

#         # Normalize function to ensure the total workers don't exceed the maximum
#         def normalize_workers(particles):
#             for i in range(len(particles)):
#                 total_workers = np.sum(particles[i])
#                 if total_workers > max_workers:
#                     particles[i] = (particles[i] / total_workers) * max_workers
#             return np.clip(particles, 1, max_workers)  # Ensure at least one worker per task

#         # Initialize particles
#         particles = np.random.randint(1, 10, (num_particles, len(tasks)))  # Random workers allocation
#         particles = normalize_workers(particles)
#         velocities = np.random.uniform(-1, 1, (num_particles, len(tasks)))

#         # Initialize the best known positions
#         personal_best_positions = particles.copy()
#         personal_best_scores = np.array([objective_function(p) for p in particles])
#         global_best_position = personal_best_positions[np.argmin(personal_best_scores)]
#         global_best_score = min(personal_best_scores)

#         # PSO main loop
#         for _ in range(num_iterations):
#             for i in range(num_particles):
#                 # Update velocity
#                 velocities[i] = (
#                     w * velocities[i]
#                     + c1 * np.random.random() * (personal_best_positions[i] - particles[i])
#                     + c2 * np.random.random() * (global_best_position - particles[i])
#                 )

#                 # Update position
#                 particles[i] = np.clip(particles[i] + velocities[i], 1, max_workers)  # Ensure workers are within valid range
#                 particles = normalize_workers(particles)  # Normalize workers to ensure constraint

#                 # Evaluate objective function
#                 score = objective_function(particles[i])

#                 # Update personal best
#                 if score < personal_best_scores[i]:
#                     personal_best_positions[i] = particles[i]
#                     personal_best_scores[i] = score

#                 # Update global best
#                 if score < global_best_score:
#                     global_best_position = particles[i]
#                     global_best_score = score

#         # Allocate workers to tasks and update remaining workers
#         shift_timedelta = timedelta(hours=24)
#         for i, task in enumerate(tasks):
#             # Determine number of workers needed for the task
#             workers_needed = int(global_best_position[i])

#             # Check if there are enough workers for each role
#             role_deficiencies = {}
#             for role in task.skills:
#                 role_id = role.skill_id  # Ensure this is correctly referencing skill_id
#                 if remaining_workers[role_id] < 1:
#                     role_deficiencies[role_id] = 1
#                 elif remaining_workers[role_id] < workers_needed:
#                     role_deficiencies[role_id] = workers_needed - remaining_workers[role_id]
#                 else:
#                     remaining_workers[role_id] -= workers_needed
#             print(f"ROLE DEFICIENCIES: {role_deficiencies}")

#             # Output deficiencies in worker allocation for the task
#             if role_deficiencies:
#                 deficiencies_str = ", ".join([f"{skills_data[role_id].name}: {deficiency}" for role_id, deficiency in role_deficiencies.items()])
#                 print(f"Task '{task.name}' - Deficiency: {deficiencies_str}")

#             # Update remaining workers for each role
#             for role_id, deficiency in role_deficiencies.items():
#                 remaining_workers[role_id] -= workers_needed

#             # Update start and end dates for each task based on dependencies and durations
#             if not task.dependencies:
#                 task.start_date = datetime.datetime(2024, 6, 1)  # Start date of the project
#             else:
#                 dependencies_end_dates = [next(t.end_date for t in tasks if t.task_id == dependency) for dependency in task.dependencies]
#                 task.start_date = max(dependencies_end_dates)

#             # Calculate task duration with equipment productivity rate
#             try:
#                 task_duration_hours = task.workload / ((1 + sum(equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments)) * global_best_position[i] * task.productivity_rate)
#             except AttributeError as e:
#                 print(f"Error calculating task duration: {e}")
#                 task_duration_hours = float('inf')  # Assign a high duration in case of error

#             task_duration_days = int(np.ceil(task_duration_hours / 8))

#             task.end_date = task.start_date + timedelta(days=task_duration_days)

#         # Calculate total project duration without and with equipment
#         total_duration_without_equipment = sum(task.workload / (1 * task.productivity_rate) for task in tasks)
#         total_duration_with_equipment = sum(task.workload / ((1 + sum(equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments)) * global_best_position[i] * task.productivity_rate) for i, task in enumerate(tasks))

#         # Output the comparison
#         print(f"Total project duration without equipment: {total_duration_without_equipment:.2f} hours")
#         print(f"Total Project Duration in Days (8-hour shift): {total_duration_without_equipment / 8}")
#         print(f"Total project duration with equipment: {total_duration_with_equipment:.2f} hours")
#         print(f"Total Project Duration in Days (8-hour shift): {total_duration_with_equipment / 8}")

#         return jsonify({
#             "message": "Task optimization completed",
#             "global_best_position": global_best_position.tolist(),
#             "global_best_score": global_best_score
#         }), 200

#     except Exception as e:
#         # Detailed error logging
#         print(f"Error: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route('/optimize-tasks/<int:project_id>', methods=['POST', 'GET'])
# def optimize_tasks(project_id):
#     try:
#         # Fetch tasks, skills, and equipment from the database
#         tasks = Task.query.filter_by(project_id=project_id).all()
#         skills_data = {skill.skill_id: skill for skill in Skill.query.all()}
#         equipment_data = {equip.equip_id: equip for equip in Equipment.query.all()}

#         if not tasks:
#             return jsonify({"error": "No tasks found for the given project ID"}), 404

#         # Example data for roles and equipment from the request body (if POST)
#         roles_data = {}
#         if request.method == 'POST':
#             data = request.json
#             roles_data = data.get('roles', {})
#             equipment_data = data.get('equipment', {})

#         # Extract maximum workers per role from the roles data
#         max_workers_per_role = {role_id: skill.max_workers for role_id, skill in skills_data.items()}
#         max_workers = sum(max_workers_per_role.values())
#         remaining_workers = {role_id: skill.max_workers for role_id, skill in skills_data.items()}

#         num_particles = 30
#         num_iterations = 100
#         w = 0.5
#         c1 = 1.0
#         c2 = 1.0
#         hours_per_day = 8

#         # Define the objective function (minimize project duration with penalty for exceeding max workers)
#         def objective_function(workers_allocation):
#             total_duration = 0
#             penalty = 0

#             for task, workers in zip(tasks, workers_allocation):
#                 if workers <= 0:
#                     workers = 1  # Ensure at least one worker per task

#                 # Calculate task duration with equipment productivity rate
#                 try:
#                     equipment_productivity_multiplier = np.prod(
#                         [1 + equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments])
#                 except AttributeError as e:
#                     print(f"Error with task equipment assignments: {e}")
#                     return float('inf')  # Return a large value to penalize incorrect configurations

#                 task_duration = (task.workload / (equipment_productivity_multiplier * workers * task.productivity_rate)) / hours_per_day
#                 total_duration += task_duration

#                 # Check for role deficiencies and calculate penalty
#                 for role in task.skills:
#                     role_id = role.skill_id  # Ensure this is correctly referencing skill_id
#                     if remaining_workers[role_id] < workers:
#                         penalty += workers - remaining_workers[role_id]

#             # Calculate total score (project duration + penalty)
#             total_score = total_duration + penalty
#             return total_score

#         # Normalize function to ensure the total workers don't exceed the maximum
#         def normalize_workers(particles):
#             for i in range(len(particles)):
#                 total_workers = np.sum(particles[i])
#                 if total_workers > max_workers:
#                     particles[i] = (particles[i] / total_workers) * max_workers
#             return np.clip(particles, 1, max_workers)  # Ensure at least one worker per task

#         # Initialize particles
#         particles = np.random.randint(1, 10, (num_particles, len(tasks)))  # Random workers allocation
#         particles = normalize_workers(particles)
#         velocities = np.random.uniform(-1, 1, (num_particles, len(tasks)))

#         # Initialize the best known positions
#         personal_best_positions = particles.copy()
#         personal_best_scores = np.array([objective_function(p) for p in particles])
#         global_best_position = personal_best_positions[np.argmin(personal_best_scores)]
#         global_best_score = min(personal_best_scores)

#         # PSO main loop
#         for _ in range(num_iterations):
#             for i in range(num_particles):
#                 # Update velocity
#                 velocities[i] = (
#                     w * velocities[i]
#                     + c1 * np.random.random() * (personal_best_positions[i] - particles[i])
#                     + c2 * np.random.random() * (global_best_position - particles[i])
#                 )

#                 # Update position
#                 particles[i] = np.clip(particles[i] + velocities[i], 1, max_workers)  # Ensure workers are within valid range
#                 particles = normalize_workers(particles)  # Normalize workers to ensure constraint

#                 # Evaluate objective function
#                 score = objective_function(particles[i])

#                 # Update personal best
#                 if score < personal_best_scores[i]:
#                     personal_best_positions[i] = particles[i]
#                     personal_best_scores[i] = score

#                 # Update global best
#                 if score < global_best_score:
#                     global_best_position = particles[i]
#                     global_best_score = score

#         # Allocate workers to tasks and update remaining workers
#         shift_timedelta = timedelta(hours=24)
#         for i, task in enumerate(tasks):
#             # Determine number of workers needed for the task
#             workers_needed = int(global_best_position[i])

#             # Check if there are enough workers for each role
#             role_deficiencies = {}
#             for role in task.skills:
#                 role_id = role.skill_id  # Ensure this is correctly referencing skill_id
#                 if remaining_workers[role_id] < 1:
#                     role_deficiencies[role_id] = 1
#                 elif remaining_workers[role_id] < workers_needed:
#                     role_deficiencies[role_id] = workers_needed - remaining_workers[role_id]
#                 else:
#                     remaining_workers[role_id] -= workers_needed

#             # Output deficiencies in worker allocation for the task
#             if role_deficiencies:
#                 deficiencies_str = ", ".join([f"{skills_data[role_id].name}: {deficiency}" for role_id, deficiency in role_deficiencies.items()])
#                 print(f"Task '{task.name}' - Deficiency: {deficiencies_str}")
            
#             allocated_workers_str = ", ".join([f"{skills_data[role.skill_id].name}: {workers_needed}" for role in task.skills])
#             print(f"Allocated Workers for Task '{task.name}': {allocated_workers_str}")
#             task['AllocatedWorkers'].append(allocated_workers_str)

#             # Update remaining workers for each role
#             for role_id, deficiency in role_deficiencies.items():
#                 remaining_workers[role_id] -= workers_needed

#             # Update start and end dates for each task based on dependencies and durations
#             if not task.dependencies:
#                 task.start_date = datetime.datetime(2024, 6, 1)  # Start date of the project
#             else:
#                 dependencies_end_dates = [next(t.end_date for t in tasks if t.task_id == dependency) for dependency in task.dependencies]
#                 task.start_date = max(dependencies_end_dates)

#             # Calculate task duration with equipment productivity rate
#             try:
#                 task_duration_hours = task.workload / ((1 + sum(equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments)) * global_best_position[i] * task.productivity_rate)
#             except AttributeError as e:
#                 print(f"Error calculating task duration: {e}")
#                 task_duration_hours = float('inf')  # Assign a high duration in case of error

#             task_duration_days = int(np.ceil(task_duration_hours / 8))

#             task.end_date = task.start_date + timedelta(days=task_duration_days)

#         # Prepare task dictionaries
#         task_dicts = []
#         for task in tasks:
#             # Fetch allocated workers for the current task
#             allocated_workers = AllocatedWorker.query.filter_by(task_id=task.task_id).all()
#             print(f"ALLOCATED WORKERS PRINT: {allocated_workers}")

#             # allocated_workers_strr = ", ".join([f"{skills_data[role.skill_id].name}: {workers_needed}" for role in task.skills])

#             # Calculate task duration with equipment productivity rate
#             try:
#                 task_duration_hours = task.workload / ((1 + sum(equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments)) * global_best_position[i] * task.productivity_rate)
#             except AttributeError as e:
#                 print(f"Error calculating task duration: {e}")
#                 task_duration_hours = float('inf')  # Assign a high duration in case of error

#             task_duration_days = int(np.ceil(task_duration_hours / 8))

#             # Initialize task dictionary
#             task_dict = {
#                 "TaskID": task.task_id,
#                 "TaskName": task.name,
#                 "Duration": task_duration_days,  # Use task_duration_days instead of task_duration_hours
#                 "StartDate": task.start_date.strftime('%a %b %d %Y 08:00:00 GMT+0800 (Philippine Standard Time)'),
#                 "EndDate": task.end_date.strftime('%a %b %d %Y 17:00:00 GMT+0800 (Philippine Standard Time)'),
#                 "ParentId": None,
#                 "Predecessor": None,
#                 "ProductivityRate": task.productivity_rate,
#                 "RequiredSkill": [skills_data[role.skill_id].name for role in task.skills],
#                 "Workload": task.workload,
#                 "Equipment": ", ".join([equipment_data[equip.equip_id].name for equip in task.equipment_assignments]),
#                 "AllocatedWorkers": {}
#             }

#             # Fill in allocated workers dictionary
#             # for allocated_worker in allocated_workers:
#             #     skill_name = Skill.query.get(allocated_worker.skill_id).name
#             #     print(f"SKILL NAME ALLOCATED: {skill_name}")
#             #     task_dict["AllocatedWorkers"][skill_name] = allocated_worker.num_workers
#             #     print(f"ALLOCATED WORKER NUM WORKERS: {allocated_worker.num_workers}")

#             # Append task dictionary to task_dicts
#             task_dicts.append(task_dict)

#         # Calculate total project duration without and with equipment
#         total_duration_without_equipment = sum(task.workload / (1 * task.productivity_rate) for task in tasks)
#         total_duration_with_equipment = sum(task.workload / ((1 + sum(equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments)) * global_best_position[i] * task.productivity_rate) for i, task in enumerate(tasks))

#         # Output the comparison
#         print(f"Total project duration without equipment: {total_duration_without_equipment:.2f} hours")
#         print(f"Total Project Duration in Days (8-hour shift): {total_duration_without_equipment / 8}")
#         print(f"Total project duration with equipment: {total_duration_with_equipment:.2f} hours")
#         print(f"Total Project Duration in Days (8-hour shift): {total_duration_with_equipment / 8}")

#         return jsonify({
#             "message": "Task optimization completed",
#             "global_best_position": global_best_position.tolist(),
#             "global_best_score": global_best_score,
#             "tasks": task_dicts
#         }), 200

#     except Exception as e:
#         # Detailed error logging
#         print(f"Error: {e}")
#         return jsonify({"error": str(e)}), 500


@app.route('/optimize-tasks/<int:project_id>', methods=['POST', 'GET'])
def optimize_tasks(project_id):
    try:
        # Fetch tasks, skills, and equipment from the database
        tasks = Task.query.filter_by(project_id=project_id).all()
        skills_data = {skill.skill_id: skill for skill in Skill.query.all()}
        equipment_data = {equip.equip_id: equip for equip in Equipment.query.all()}

        if not tasks:
            return jsonify({"error": "No tasks found for the given project ID"}), 404

        
        # Fetch project data to get the start date of the project
        project = Project.query.get(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404

        project_start_date = project.start_date

        # Example data for roles and equipment from the request body (if POST)
        roles_data = {}
        if request.method == 'POST':
            data = request.json
            roles_data = data.get('roles', {})
            equipment_data = data.get('equipment', {})

        # Extract maximum workers per role from the roles data
        max_workers_per_role = {role_id: skill.max_workers for role_id, skill in skills_data.items()}
        max_workers = sum(max_workers_per_role.values())
        remaining_workers = {role_id: skill.max_workers for role_id, skill in skills_data.items()}

        num_particles = 30
        num_iterations = 100
        w = 0.5
        c1 = 1.0
        c2 = 1.0
        hours_per_day = 8

        # Define the objective function (minimize project duration with penalty for exceeding max workers)
        def objective_function(workers_allocation):
            total_duration = 0
            penalty = 0

            for task, workers in zip(tasks, workers_allocation):
                if workers <= 0:
                    workers = 1  # Ensure at least one worker per task

                # Calculate task duration with equipment productivity rate
                try:
                    equipment_productivity_multiplier = np.prod(
                        [1 + equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments])
                except AttributeError as e:
                    print(f"Error with task equipment assignments: {e}")
                    return float('inf')  # Return a large value to penalize incorrect configurations

                task_duration = (task.workload / (equipment_productivity_multiplier * workers * task.productivity_rate)) / hours_per_day
                total_duration += task_duration

                # Check for role deficiencies and calculate penalty
                for role in task.skills:
                    role_id = role.skill_id  # Ensure this is correctly referencing skill_id
                    if remaining_workers[role_id] < workers:
                        penalty += workers - remaining_workers[role_id]

            # Calculate total score (project duration + penalty)
            total_score = total_duration + penalty
            return total_score

        # Normalize function to ensure the total workers don't exceed the maximum
        def normalize_workers(particles):
            for i in range(len(particles)):
                total_workers = np.sum(particles[i])
                if total_workers > max_workers:
                    particles[i] = (particles[i] / total_workers) * max_workers
            return np.clip(particles, 1, max_workers)  # Ensure at least one worker per task

        # Initialize particles
        particles = np.random.randint(1, 10, (num_particles, len(tasks)))  # Random workers allocation
        particles = normalize_workers(particles)
        velocities = np.random.uniform(-1, 1, (num_particles, len(tasks)))

        # Initialize the best known positions
        personal_best_positions = particles.copy()
        personal_best_scores = np.array([objective_function(p) for p in particles])
        global_best_position = personal_best_positions[np.argmin(personal_best_scores)]
        global_best_score = min(personal_best_scores)

        # PSO main loop
        for _ in range(num_iterations):
            for i in range(num_particles):
                # Update velocity
                velocities[i] = (
                    w * velocities[i]
                    + c1 * np.random.random() * (personal_best_positions[i] - particles[i])
                    + c2 * np.random.random() * (global_best_position - particles[i])
                )

                # Update position
                particles[i] = np.clip(particles[i] + velocities[i], 1, max_workers)  # Ensure workers are within valid range
                particles = normalize_workers(particles)  # Normalize workers to ensure constraint

                # Evaluate objective function
                score = objective_function(particles[i])

                # Update personal best
                if score < personal_best_scores[i]:
                    personal_best_positions[i] = particles[i]
                    personal_best_scores[i] = score

                # Update global best
                if score < global_best_score:
                    global_best_position = particles[i]
                    global_best_score = score

        # Allocate workers to tasks and update remaining workers
        task_dicts = []
        shift_timedelta = timedelta(hours=24)
        for i, task in enumerate(tasks):
            # Determine number of workers needed for the task
            workers_needed = int(global_best_position[i])

            # Check if there are enough workers for each role
            role_deficiencies = {}
            for role in task.skills:
                role_id = role.skill_id  # Ensure this is correctly referencing skill_id
                if remaining_workers[role_id] < 1:
                    role_deficiencies[role_id] = 1
                elif remaining_workers[role_id] < workers_needed:
                    role_deficiencies[role_id] = workers_needed - remaining_workers[role_id]
                else:
                    remaining_workers[role_id] -= workers_needed

            # Output deficiencies in worker allocation for the task
            if role_deficiencies:
                deficiencies_str = ", ".join([f"{skills_data[role_id].name}: {deficiency}" for role_id, deficiency in role_deficiencies.items()])
                print(f"Task '{task.name}' - Deficiency: {deficiencies_str}")
            
            allocated_workers_str = ", ".join([f"{skills_data[role.skill_id].name}: {workers_needed}" for role in task.skills])
            print(f"Allocated Workers for Task '{task.name}': {allocated_workers_str}")

            # Update remaining workers for each role
            for role_id, deficiency in role_deficiencies.items():
                remaining_workers[role_id] -= workers_needed

            # Update start and end dates for each task based on dependencies and durations
            if not task.dependencies:
                # task.start_date = datetime.datetime(2024, 6, 1)  # Start date of the project
                task.start_date = project_start_date
            else:
                dependencies_end_dates = [next(t.end_date for t in tasks if t.task_id == dependency) for dependency in task.dependencies]
                task.start_date = max(dependencies_end_dates) + datetime.timedelta(days=1)

            # Calculate task duration with equipment productivity rate
            try:
                task_duration_hours = task.workload / ((1 + sum(equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments)) * global_best_position[i] * task.productivity_rate)
            except AttributeError as e:
                print(f"Error calculating task duration: {e}")
                task_duration_hours = float('inf')  # Assign a high duration in case of error

            task_duration_days = int(np.ceil(task_duration_hours / 8))

            task.end_date = task.start_date + timedelta(days=task_duration_days)
            
            # Initialize task dictionary
            predecessors = [str(dep) for dep in task.dependencies] if task.dependencies else []
            task_dict = {
                "TaskID": task.task_id,
                "TaskName": task.name,
                "Duration": task_duration_days,  # Use task_duration_days instead of task_duration_hours
                "StartDate": task.start_date.strftime('%a %b %d %Y 08:00:00 GMT+0800 (Philippine Standard Time)'),
                "EndDate": task.end_date.strftime('%a %b %d %Y 17:00:00 GMT+0800 (Philippine Standard Time)'),
                "ParentId": None,
                "Predecessor": ", ".join(predecessors),
                "ProductivityRate": task.productivity_rate,
                "RequiredSkill": [skills_data[role.skill_id].name for role in task.skills],
                "Workload": task.workload,
                "Equipment": ", ".join([equipment_data[equip.equip_id].name for equip in task.equipment_assignments]),
                "AllocatedWorkers": allocated_workers_str
            }
            task_dicts.append(task_dict)

        # Calculate total project duration without and with equipment
        total_duration_without_equipment = sum(task.workload / (1 * task.productivity_rate) for task in tasks)
        total_duration_with_equipment = sum(task.workload / ((1 + sum(equipment_data[equip.equip_id].productivity for equip in task.equipment_assignments)) * global_best_position[i] * task.productivity_rate) for i, task in enumerate(tasks))

        # Output the comparison
        print(f"Total project duration without equipment: {total_duration_without_equipment:.2f} hours")
        print(f"Total Project Duration in Days (8-hour shift): {total_duration_without_equipment / 8}")
        print(f"Total project duration with equipment: {total_duration_with_equipment:.2f} hours")
        print(f"Total Project Duration in Days (8-hour shift): {total_duration_with_equipment / 8}")

        # return jsonify({
        #     "message": "Task optimization completed",
        #     "global_best_position": global_best_position.tolist(),
        #     "global_best_score": global_best_score,
        #     "tasks": task_dicts
        # }), 200
        return jsonify(task_dicts)

    except Exception as e:
        # Detailed error logging
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500




@app.route("/check_user_exists/<user_id>", methods=["GET"])
def check_user_exists(user_id):
    """
    Route to check if a user exists in the database based on user ID.
    """
    try:
        # Convert user ID to integer (adjust if ID is a different type)
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({"error": "Invalid user ID format"}), 400  # Bad Request

        # Query for user by ID
        user = Employees.query.get(user_id)

        if user:
            return jsonify({"message": "User exists!", "id": user_id}), 200  # OK
        else:
            return jsonify({"message": "User not found."}), 404  # Not Found

    except Exception as e:
        # Handle any exceptions during database operations
        return jsonify({"error": str(e)}), 500  # Internal Server Error

@app.route("/output_all_data")
def output_all_data():
    """
    Retrieves all employees from the database and returns them as a JSON response.
    """
    try:
        # all_employees = Employees.query.all()  # Fetch all employees from the database
        # all_users = Users.query.all()
        all_users = Users.query.filter_by(jwt_auth_active=True)
        # all_skills = Skill.query.all()
        

        users_data = [
            {"id": user.id, "username": user.username,"email": user.email} for user in all_users
        ]
        # skill_data = [
        #     {"id": skill.skill_id, "name": skill.name} for skill in all_skills
        # ]

        # employee_data = [
        #     {"id": employee.id, "first_name": employee.first_name, "last_name": employee.last_name,
        #      "gender": employee.gender, "role": employee.role} for employee in all_employees
        # ]

        # return jsonify({"message": "All employees data:", "employees": employee_data})
        return jsonify({"message": "All users data:", "employees": users_data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Internal Server Error


@app.route('/custom_route', methods=['GET'])
def custom_route():
    # req_data = request.get_json()
    # email = req_data.get("email")
    # return jsonify({'message': 'This is a custom route!'})
    email = Users.query.filter_by(email="elma@gmail.com")
    return jsonify(email)

@app.route("/gett")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = Users.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    }) 



# Error handling: Create a custom exception class for PSO-related errors
class PSOError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(message)

# Endpoint for task assignment optimization
@app.route('/optimize-task-assignment/<int:project_id>', methods=['GET'])
def optimize_task_assignment(project_id):
    try:
        # Retrieve project by ID
        project = Project.query.get_or_404(project_id)

        if not project:
            abort(404, description="No project found.")
        
        # Retrieve tasks, manpower, and skills related to the project
        tasks = project.tasks
        if not tasks:
            abort(404, description="No tasks found for the specified project.")

        manpower = Manpower.query.all()
        if not manpower:
            abort(404, description="No manpower found.")

        # Instantiate PSO with tasks and manpower
        pso = PSO(tasks, manpower)

        # Perform optimization to assign tasks to manpower
        best_assignments = pso.optimize()

        # Save best assignments to database
        for i, task in enumerate(tasks):
            task_manpower = best_assignments[i]
            for mp in task_manpower:
                task_manpower_assignment = TaskManpower(task_id=task.task_id, manpower_id=mp.manpower_id,
                                                        start_date=task.start_date, end_date=task.end_date)
                db.session.add(task_manpower_assignment)
        
        db.session.commit()
        
        # Return optimized task assignments as JSON response
        assignments = []
        for i, task in enumerate(tasks):
            task_manpower = best_assignments[i]
            manpower_names = [mp.name for mp in task_manpower]
            assignments.append({
                'task_id': task.task_id,
                'task_name': task.name,
                'assigned_manpower': manpower_names,
                'start_date': task.start_date.strftime('%Y-%m-%d'),
                'end_date': task.end_date.strftime('%Y-%m-%d'),
            })
        
        return jsonify({'project_id': project_id, 'assignments': assignments})

    except PSOError as e:
        # Handle PSO-specific errors
        abort(400, description=f"PSO error: {e.message}")
    except Exception as e:
        # Handle other exceptions and rollback the transaction
        db.session.rollback()
        abort(500, description=f"An unexpected error occurred: {str(e)}")


@app.route('/projects', methods=['POST'])
@token_required  # Ensures only logged-in users can access this route
def add_project(self, current_user):
    try:
        # Parse incoming JSON data from the request
        data = request.json

        # Validate required data
        name = data.get('name')
        start_date = data.get('start_date')
        duration = data.get('duration')
        location = data.get('location')

        # Convert start_date to datetime object
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
        except ValueError:
            abort(400, description="Invalid start date format. Expected format: YYYY-MM-DD")

        # Retrieve the current logged-in user
        manager_id = current_user.id

        # Create a new project
        new_project = Project(
            name=name,
            start_date=start_date,
            duration=duration,
            location=location,
            manager_id=manager_id  # Use the current logged-in user's ID as the manager ID
        )

        # Add the new project to the database
        db.session.add(new_project)
        db.session.commit()

        # Return the details of the newly created project as a JSON response
        response = {
            'project_id': new_project.project_id,
            'name': new_project.name,
            'start_date': new_project.start_date.strftime('%Y-%m-%d'),
            'duration': new_project.duration,
            'location': new_project.location,
            'manager_id': new_project.manager_id,
        }

        return jsonify(response), 201  # Return 201 status code for successful creation

    except ValueError as ve:
        # Handle value errors (e.g., date parsing issues)
        db.session.rollback()
        abort(400, description=f"Invalid data: {str(ve)}")

    except Exception as e:
        # Handle other exceptions and rollback the transaction
        db.session.rollback()
        abort(500, description=f"An unexpected error occurred: {str(e)}")


@app.route('/add', methods=['POST'])
#@token_required
def add_project_route():
    # Ensure the user is authenticated
    current_user_id = session.get('current_user_id')
    
    if current_user_id is None:
        return jsonify({"success": False, "msg": "User not authenticated.","id-session": session.get('current_user_id'),}), 403
    
    # Get project data from the request
    req_data = request.get_json()
    
    # Retrieve data from the request
    name = req_data.get('name')
    start_date = req_data.get('start_date')
    duration = req_data.get('duration')
    location = req_data.get('location')
    
    # Add the project using the function
    new_project = Project(
        name=name,
        start_date=start_date,
        duration=duration,
        location=location,
        manager_id=current_user_id  # Set the manager ID to the current user
    )
    
    # Save the new project
    #new_project.save()
    
    # Return a success message
    return jsonify({"success": True, "msg": "Project added successfully.", "session-id": current_user_id}), 200
