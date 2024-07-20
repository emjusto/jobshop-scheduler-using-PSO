# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from datetime import datetime
import random

import json

from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
# db_postgresql = SQLAlchemy()  # For PostgreSQL


class Users(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(64), nullable=True)
    password = db.Column(db.Text())
    jwt_auth_active = db.Column(db.Boolean())
    date_joined = db.Column(db.DateTime(), default=datetime.utcnow)

    # Relationship to Project model
    projects = db.relationship('Project', backref='project_manager', lazy=True)

    def __repr__(self):
        return f"User {self.username}"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def update_email(self, new_email):
        self.email = new_email

    def update_username(self, new_username):
        self.username = new_username

    def check_jwt_auth_active(self):
        return self.jwt_auth_active

    def set_jwt_auth_active(self, set_status):
        self.jwt_auth_active = set_status

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()
    
    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def toDICT(self):

        cls_dict = {}
        cls_dict['_id'] = self.id
        cls_dict['username'] = self.username
        cls_dict['email'] = self.email

        return cls_dict

    def toJSON(self):

        return self.toDICT()


class JWTTokenBlocklist(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    jwt_token = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False)

    def __repr__(self):
        return f"Expired Token: {self.jwt_token}"

    def save(self):
        db.session.add(self)
        db.session.commit()


# class Employees(db_postgresql.Model):
#     id = db_postgresql.Column(db_postgresql.Integer, primary_key=True)
#     first_name = db_postgresql.Column(db_postgresql.String(50), nullable=False)
#     last_name = db_postgresql.Column(db_postgresql.String(50), nullable=False)
#     gender = db_postgresql.Column(db_postgresql.String(10), nullable=False)
#     role = db_postgresql.Column(db_postgresql.String(50), nullable=False)

#     def __repr__(self):
#         return f"Employee(id={self.id}, first_name={self.first_name}, last_name={self.last_name}, gender={self.gender}, role={self.role})"

class Skill(db.Model):
    __tablename__ = 'skills'

    skill_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), nullable=False)  # Skill/role name
    description = db.Column(db.Text(), nullable=True)
    max_workers = db.Column(db.Integer(), nullable=True)  # Maximum number of workers for this skill

    def __repr__(self):
        return f"Skill(id={self.skill_id}, name={self.name}, description={self.description}, max_workers={self.max_workers})"

    def to_dict(self):
        return {
            'skill_id': self.skill_id,
            'name': self.name,
            'description': self.description,
            'max_workers': self.max_workers
        }

# Intermediary table for Project and Skill
class ProjectSkill(db.Model):
    __tablename__ = 'project_skills'
    
    project_id = db.Column(db.Integer(), db.ForeignKey('projects.project_id',ondelete='CASCADE'), nullable=False)
    skill_id = db.Column(db.Integer(), db.ForeignKey('skills.skill_id',ondelete='CASCADE'), nullable=False)
    db.PrimaryKeyConstraint(project_id, skill_id)
    # __table_args__ = (
    #     db.PrimaryKeyConstraint(project_id, skill_id),
    # )

# Intermediary table for Task and Skill
class TaskSkill(db.Model):
    __tablename__ = 'task_skills'

    task_id = db.Column(db.Integer(), db.ForeignKey('tasks.task_id',ondelete='CASCADE'), nullable=False)
    skill_id = db.Column(db.Integer(), db.ForeignKey('skills.skill_id',ondelete='CASCADE'), nullable=False)
    db.PrimaryKeyConstraint(task_id, skill_id)
    # __table_args__ = (
    #     db.PrimaryKeyConstraint(task_id, skill_id),
    # )

# Project model
class Project(db.Model):
    __tablename__ = 'projects'

    project_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    start_date = db.Column(db.Date(), nullable=False)
    duration = db.Column(db.Integer(), nullable=True) 
    start_date = db.Column(db.Date(), nullable=True)
    end_date = db.Column(db.Date(), nullable=True)
    location = db.Column(db.String(255), nullable=False)  # Project location
    
    # Relationship to project manager
    manager_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)
    
    task_ids = db.Column(db.String, nullable=True)  # Storing task IDs as a comma-separated string
    # Relationship to tasks
    # tasks = db.relationship('Task', backref='project', lazy=True)
    
    # Relationship to skills
    # skills = db.relationship('Skill', secondary='project_skills', backref='projects', lazy=True)

    def save(self):
        db.session.add(self)
        db.session.commit()

# Task model
class Task(db.Model):
    __tablename__ = 'tasks'

    task_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    duration = db.Column(db.Integer(), nullable=False)  # Duration of the task in days
    start_date = db.Column(db.Date(), nullable=True)
    end_date = db.Column(db.Date(), nullable=True)
    project_id = db.Column(db.Integer(), db.ForeignKey('projects.project_id',ondelete='CASCADE'),nullable=False)
    parent_id = db.Column(db.Integer(), db.ForeignKey('tasks.task_id', ondelete='CASCADE'), nullable=True)
    workload = db.Column(db.Integer(), nullable=False)  # Workload of the task
    productivity_rate = db.Column(db.Float(), nullable=True)  # Productivity rate of the task
    unit = db.Column(db.String(255), nullable=True)
    dependencies = db.Column(db.ARRAY(db.Integer()), nullable=True)  # List of task dependencies
    allocated_workers = db.Column(db.String(255), nullable=True)

    parent = db.relationship('Task', remote_side=[task_id], backref='children', cascade='all, delete')
    
    # Relationship to manpower and equipment
    manpower_assignments = db.relationship('TaskManpower', backref='task', lazy=True)
    equipment_assignments = db.relationship('TaskEquipment', backref='task', lazy=True,cascade='all, delete')
    
    # Relationship to skills
    skills = db.relationship('Skill', secondary='task_skills', backref='tasks', lazy=True)
    # allocated_workers = db.relationship('AllocatedWorker', backref='task',lazy=True)
    # equipment = db.relationship('Equipment', secondary='task_equipment', backref='tasks', lazy=True)

    def to_dict(self):
        return {
            "task_id": self.task_id,
            "name": self.name,
            "duration": self.duration,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "project_id": self.project_id,
            "parent_id": self.parent_id,
            "workload": self.workload,
            "productivity_rate": self.productivity_rate,
            "dependencies": self.dependencies,
            # "required_skill": self.required_skill,
            # "resources": self.resources
        }

# Manpower model
class Manpower(db.Model):
    __tablename__ = 'manpower'

    manpower_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), nullable=False)  # Manpower name

    # Relationship with skills
    skills = db.relationship('Skill', secondary='manpower_skills', backref='manpowers', lazy=True)

    # Relationship with task manpower assignments
    task_assignments = db.relationship('TaskManpower', backref='manpower', lazy=True)

    def __repr__(self):
        return f"Manpower(id={self.id}, name={self.name}"

    def to_dict(self):
        return {
            'id': self.manpower_id,
            'name': self.name,
            'skills': [skill.to_dict() for skill in self.skills] if self.skills else []  # Convert each skill to its dictionary representation
        }

# Intermediary table for Manpower and Skill
class ManpowerSkill(db.Model):
    __tablename__ = 'manpower_skills'

    manpower_id = db.Column(db.Integer(), db.ForeignKey('manpower.manpower_id', ondelete='CASCADE'), nullable=False)
    skill_id = db.Column(db.Integer(), db.ForeignKey('skills.skill_id', ondelete='CASCADE'), nullable=False)
    db.PrimaryKeyConstraint(manpower_id, skill_id)
    # __table_args__ = (
    #     db.PrimaryKeyConstraint(manpower_id, skill_id),
    # )

# TaskManpower model (many-to-many relationship)
class TaskManpower(db.Model):
    __tablename__ = 'task_manpower'

    id = db.Column(db.Integer(), primary_key=True)
    task_id = db.Column(db.Integer(), db.ForeignKey('tasks.task_id',ondelete='CASCADE'), nullable=False)
    manpower_id = db.Column(db.Integer(), db.ForeignKey('manpower.manpower_id',ondelete='CASCADE'), nullable=False)
    start_date = db.Column(db.Date(), nullable=True)
    end_date = db.Column(db.Date(), nullable=True)
    # __table_args__ = (
    #     db.PrimaryKeyConstraint(task_id, manpower_id),
    # )

# Equipment model
class Equipment(db.Model):
    __tablename__ = 'equipment'

    equip_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text(), nullable=True)
    productivity = db.Column(db.Float(), nullable=True)  # Productivity rate of the equipment
    unit = db.Column(db.String(255), nullable=True)
    # availability = db.Column(db.String(255), nullable=True)

    # Relationship to task equipment assignments
    task_assignments = db.relationship('TaskEquipment', backref='equipment', lazy=True)

    def to_dict(self):
        return {
            'equip_id': self.equip_id,
            'name': self.name,
            'description': self.description
        }

# TaskEquipment model (many-to-many relationship)
class TaskEquipment(db.Model):
    __tablename__ = 'task_equipment'

    id = db.Column(db.Integer(), primary_key=True)
    task_id = db.Column(db.Integer(), db.ForeignKey('tasks.task_id',ondelete='CASCADE'), nullable=False)
    equip_id = db.Column(db.Integer(), db.ForeignKey('equipment.equip_id',ondelete='CASCADE'), nullable=False)
    start_date = db.Column(db.Date(), nullable=True)
    end_date = db.Column(db.Date(), nullable=True)
    # db.PrimaryKeyConstraint(task_id, equip_id)
    # __table_args__ = (
    #     db.PrimaryKeyConstraint(task_id, equip_id),
    # )


class PSO:
    def __init__(self, tasks, manpower, num_particles=30, num_iterations=100):
        self.tasks = tasks
        self.manpower = manpower
        self.num_particles = num_particles
        self.num_iterations = num_iterations
        self.particles = [Particle(tasks, manpower) for _ in range(num_particles)]
        self.global_best_position = None
        self.global_best_fitness = float('-inf')

    def optimize(self):
        # Initialize global best position
        for particle in self.particles:
            if particle.best_fitness > self.global_best_fitness:
                self.global_best_fitness = particle.best_fitness
                self.global_best_position = particle.best_position

        # Iterate through each iteration
        for _ in range(self.num_iterations):
            for particle in self.particles:
                # Update particle velocity and position
                particle.update_velocity(self.global_best_position)
                particle.update_position()

                # Update particle's best position and fitness
                particle.update_best()

                # Update global best if needed
                if particle.best_fitness > self.global_best_fitness:
                    self.global_best_fitness = particle.best_fitness
                    self.global_best_position = particle.best_position

        # Return the global best position (optimal assignment)
        return self.global_best_position

class Particle:
    def __init__(self, tasks, manpower):
        self.tasks = tasks
        self.manpower = manpower
        self.position = self.random_position()
        self.velocity = [0] * len(tasks)
        self.best_position = self.position[:]
        self.best_fitness = self.calculate_fitness(self.position)

    def random_position(self):
        # Randomly assign tasks to manpower
        return [random.sample(self.manpower, len(task.skills)) for task in self.tasks]

    def calculate_fitness(self, position):
        # Calculate fitness based on the given task assignment
        fitness = 0
        assigned_manpower = set()
        task_overlap_penalty = 5
        
        for i, task in enumerate(self.tasks):
            task_manpower = position[i]
            
            # Check if the manpower have the required skills for the task
            for mp in task_manpower:
                # Ensure manpower has the necessary skills for the task
                mp_skills = set([skill.name for skill in mp.skills])
                task_skills = set([skill.name for skill in task.skills])
                
                if not task_skills.issubset(mp_skills):
                    fitness -= 10  # Penalize skill mismatch
                
                # Check manpower availability
                if not mp.is_available_for_task(task):
                    fitness -= 20  # Penalize if manpower isn't available
                
                # Track the manpower assignments
                assigned_manpower.add(mp.id)
                
        # Penalize task overlap
        for mp_id in assigned_manpower:
            # Calculate total time assigned to each manpower
            total_assigned_time = 0
            for i, task in enumerate(self.tasks):
                task_manpower = position[i]
                if any(mp.id == mp_id for mp in task_manpower):
                    total_assigned_time += task.duration
            
            # Penalize if manpower is overbooked (assigned to too many tasks)
            if total_assigned_time > mp.get_available_time():
                fitness -= task_overlap_penalty
        
        return fitness

    def update_velocity(self, global_best_position):
        c1 = 2.0
        c2 = 2.0
        w = 0.7
        
        for i in range(len(self.tasks)):
            r1 = random.random()
            r2 = random.random()
            self.velocity[i] = (
                w * self.velocity[i]
                + c1 * r1 * (self.best_position[i] - self.position[i])
                + c2 * r2 * (global_best_position[i] - self.position[i])
            )

    def update_position(self):
        for i in range(len(self.tasks)):
            # Adjust position (task assignments)
            self.position[i] += self.velocity[i]

            # Constrain position within valid range
            self.position[i] = max(0, min(len(self.manpower) - 1, self.position[i]))
        
        # Ensure each task is assigned the required number of manpower
        self.position = [random.sample(self.manpower, len(task.skills)) for i, task in enumerate(self.tasks)]

    def update_best(self):
        current_fitness = self.calculate_fitness(self.position)
        if current_fitness > self.best_fitness:
            self.best_fitness = current_fitness
            self.best_position = self.position[:]


from datetime import datetime, timedelta
from math import ceil

# Data
roles_data = {
    1: {"id": 1, "name": "Carpenter", "max_workers": 60},
    2: {"id": 2, "name": "Steelmen", "max_workers": 60},
    3: {"id": 3, "name": "Mason", "max_workers": 15},
    4: {"id": 4, "name": "Helper", "max_workers": 46},
    5: {"id": 5, "name": "Electrician", "max_workers": 30},
    6: {"id": 6, "name": "Plumber", "max_workers": 20},
    7: {"id": 7, "name": "Roofer", "max_workers": 25},
    8: {"id": 8, "name": "Painter", "max_workers": 15},
    9: {"id": 9, "name": "Drywall Installer", "max_workers": 15},
    10: {"id": 10, "name": "Inspector", "max_workers": 5}
}

equipment_data = {
    1: {"id": 1, "name": "Crane", "productivity": 30},
    2: {"id": 2, "name": "Excavator", "productivity": 20},
    3: {"id": 3, "name": "Concrete Mixer", "productivity": 5},
    4: {"id": 4, "name": "Hammer", "productivity": 50},
    5: {"id": 5, "name": "Saw", "productivity": 50},
    6: {"id": 6, "name": "Drill", "productivity": 20},
    7: {"id": 7, "name": "Wire Stripper", "productivity": 20},
    8: {"id": 8, "name": "Pipe Wrench", "productivity": 10},
    9: {"id": 9, "name": "Pipe Cutter", "productivity": 10},
    10: {"id": 10, "name": "Ladder", "productivity": 5},
    11: {"id": 11, "name": "Nail Gun", "productivity": 15},
    12: {"id": 12, "name": "Paint Roller", "productivity": 5},
    13: {"id": 13, "name": "Drywall Saw", "productivity": 10}
}

tasks = [
    {
        "id": 1,
        "name": "Site Preparation",
        "duration": 3,
        "start_date": "Mon Jun 03 2024 08:00:00",
        "end_date": "Wed Jun 05 2024 17:00:00",
        "parent_id": None,
        "dependencies": [],
        "productivity_rate": 0.5,
        "required_roles": {1, 2},
        "workload": 11056.24,
        "required_equipment": [1, 2]
    },
    {
        "id": 2,
        "name": "Foundation Laying",
        "duration": 5,
        "start_date": "Thu Jun 06 2024 08:00:00",
        "end_date": "Mon Jun 10 2024 17:00:00",
        "parent_id": None,
        "dependencies": [1],
        "productivity_rate": 0.3,
        "required_roles": {3},
        "workload": 704.8,
        "required_equipment": [3, 4]
    },
    {
        "id": 3,
        "name": "Framing",
        "duration": 7,
        "start_date": "Tue Jun 11 2024 08:00:00",
        "end_date": "Mon Jun 17 2024 17:00:00",
        "parent_id": None,
        "dependencies": [2],
        "productivity_rate": 0.37,
        "required_roles": {4},
        "workload": 155.88,
        "required_equipment": [5, 6, 7]
    },
    {
        "id": 4,
        "name": "Electrical Installation",
        "duration": 4,
        "start_date": "Tue Jun 18 2024 08:00:00",
        "end_date": "Fri Jun 21 2024 17:00:00",
        "parent_id": None,
        "dependencies": [3],
        "productivity_rate": 0.8,
        "required_roles": {5},
        "workload": 28
    },
    {
        "id": 5,
        "name": "Plumbing Installation",
        "duration": 4,
        "start_date": "Sat Jun 22 2024 08:00:00",
        "end_date": "Tue Jun 25 2024 17:00:00",
        "parent_id": None,
        "dependencies": [3],
        "productivity_rate": 0.75,
        "required_roles": {6},
        "workload": 150
    },
    {
        "id": 6,
        "name": "Roofing",
        "duration": 5,
        "start_date": "Wed Jun 26 2024 08:00:00",
        "end_date": "Sun Jun 30 2024 17:00:00",
        "parent_id": None,
        "dependencies": [4],
        "productivity_rate": 0.85,
        "required_roles": {7},
        "workload": 220
    },
    {
        "id": 7,
        "name": "Interior Finishing",
        "duration": 7,
        "start_date": "Mon Jul 01 2024 08:00:00",
        "end_date": "Sun Jul 07 2024 17:00:00",
        "parent_id": None,
        "dependencies": [6],
        "productivity_rate": 0.9,
        "required_roles": {8, 9},
        "workload": 250
    },
    {
        "id": 8,
        "name": "Final Inspection",
        "duration": 1,
        "start_date": "Mon Jul 08 2024 08:00:00",
        "end_date": "Mon Jul 08 2024 17:00:00",
        "parent_id": None,
        "dependencies": [7],
        "productivity_rate": 1.0,
        "required_roles": {10},
        "workload": 50,
        "required_equipment": [1]
    }
]

# Helper functions
def parse_date(date_str):
    return datetime.strptime(date_str, "%a %b %d %Y %H:%M:%S")

def calculate_duration(task, role_data):
    total_hours_needed = task["workload"] / task["productivity_rate"]
    max_workers = min([role_data[role_id]["max_workers"] for role_id in task["required_roles"]])
    duration_hours = ceil(total_hours_needed / max_workers)
    duration_days = ceil(duration_hours / 8)
    return duration_hours, max_workers

# Calculate durations and allocate workers
for task in tasks:
    task["allocated_workers"] = {}
    duration_hours, max_workers = calculate_duration(task, roles_data)
    task["duration"] = duration_hours
    for role_id in task["required_roles"]:
        workers_needed = ceil(task["workload"] / (task["productivity_rate"] * 8 * (task["duration"] / 8)))
        actual_workers_needed = min(workers_needed, roles_data[role_id]["max_workers"])
        task["allocated_workers"][role_id] = actual_workers_needed

# Update start and end dates based on dependencies
start_date = parse_date(tasks[0]["start_date"])

for task in tasks:
    if task["dependencies"]:
        dependency_end_dates = [
            parse_date(tasks[dep_id - 1]["end_date"]) for dep_id in task["dependencies"]
        ]
        start_date = max(dependency_end_dates) + timedelta(days=1)

    task["start_date"] = start_date.strftime("%a %b %d %Y %H:%M:%S")
    end_date = start_date + timedelta(hours=task["duration"] - 1)
    end_date = end_date.replace(hour=17, minute=0)
    task["end_date"] = end_date.strftime("%a %b %d %Y %H:%M:%S")
    start_date = end_date + timedelta(days=1)

# Calculate total project duration
project_start = parse_date(tasks[0]["start_date"])
project_end = parse_date(tasks[-1]["end_date"])
total_duration_days = (project_end - project_start).days + 1
total_duration_hours = total_duration_days * 8

# Output updated tasks data
for task in tasks:
    print(task)

print(f"Total project duration: {total_duration_days}")
