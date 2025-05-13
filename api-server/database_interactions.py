import os
import json
import psycopg2
import uuid
from dotenv import load_dotenv
from datetime import datetime
from flask import jsonify


load_dotenv()

def get_db_connection():
    DB_CONNECTION_URL = os.environ.get('DB_CONNECTION_URL')
    conn = psycopg2.connect(DB_CONNECTION_URL)
    return conn

def fetch_candidate_details(conversation_id):
    conn = get_db_connection()
    cur = conn.cursor()
    query = """
        SELECT *
        FROM candidate_applications
        WHERE id = %s
    """
    cur.execute(query, (conversation_id,))
    conversation = cur.fetchone()
    cur.close()
    conn.close()
    
    if not conversation:
        return None
    
    profile = {
        'id': conversation[0],  
        'candidateName': conversation[2],  
        'desiredPosition': conversation[3],
        'desiredSalary': conversation[4],
        'hasAgreedToUpperSalaryRange': conversation[5],
        'registrationNumber': conversation[6],
        'registrationState': conversation[7],
        'expectedRegistrationDate': conversation[8],
        'hasTwoYearsExperience': conversation[9],
        'experienceDescription': conversation[11],
    }

    messages = conversation[10]  
    return jsonify({
        'candidateProfile': profile,
        'status': conversation[1],  
        'messages': messages
    })

def create_conversation(messages, name, position, salary, has_agreed_to_upper_salary_range, registration_number, registration_state, expected_registration_date, has_two_years_experience, experience_description, status):
    id = str(uuid.uuid4())
    conn = get_db_connection()
    cur = conn.cursor()
    query = """
        INSERT INTO candidate_applications (id, conversation, candidate_name, desired_position, desired_salary, has_agreed_to_upper_salary_range, registration_number, registration_state, expected_registration_date, has_two_years_experience, experience_description, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    cur.execute(query, (id, json.dumps(messages), name, position, salary, has_agreed_to_upper_salary_range, registration_number, registration_state, expected_registration_date, has_two_years_experience, experience_description, status))
    conn.commit()
    cur.close()
    conn.close()
    return id

def save_conversation(conversation_id, name, position, salary, has_agreed_to_upper_salary_range, registration_number, registration_state, expected_registration_date, has_two_years_experience, experience_description, status, messages):
    conn = get_db_connection()
    cur = conn.cursor()
    query = """
        UPDATE candidate_applications
        SET candidate_name = %s, desired_position = %s, desired_salary = %s, has_agreed_to_upper_salary_range = %s, registration_number = %s, registration_state = %s, expected_registration_date = %s, has_two_years_experience = %s, experience_description = %s, status = %s, conversation = %s
        WHERE id = %s
    """
    cur.execute(query, (name, position, salary, has_agreed_to_upper_salary_range, registration_number, registration_state, expected_registration_date, has_two_years_experience, experience_description, status, json.dumps(messages), conversation_id))
    conn.commit()
    cur.close()
    conn.close()
    return
