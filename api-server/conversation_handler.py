from flask import jsonify
from datetime import datetime
import uuid
import os
import psycopg2

# In-memory storage for conversations
conversations = {}

def get_db_connection():
    DB_CONNECTION_URL = os.environ.get('DB_CONNECTION_URL')
    conn = psycopg2.connect(DB_CONNECTION_URL)
    return conn

def fetch_conversation(conversation_id):
    conn = get_db_connection()
    cur = conn.cursor()
    query = """
        SELECT *
        FROM conversations
        WHERE id = %s
    """
    cur.execute(query, (conversation_id,))
    conversation = cur.fetchone()
    cur.close()
    conn.close()
    return conversation

def create_conversation():
    id = str(uuid.uuid4())
    conn = get_db_connection()
    cur = conn.cursor()
    query = """
        INSERT INTO conversations (id)
        VALUES (%s)
        RETURNING id
    """
    cur.execute(query, (id,))
    conn.commit()
    cur.close()
    conn.close()
    return id

def save_conversation(conversation_id, name, position, salary, has_agreed_to_upper_salary_range, registration_number, registration_state, expected_registration_date, has_two_years_experience, experience_description):
    conn = get_db_connection()
    cur = conn.cursor()
    query = """
        UPDATE conversations
        SET candidate_name = %s, desired_position = %s, desired_salary = %s, has_agreed_to_upper_salary_range = %s, registration_number = %s, registration_state = %s, expected_registration_date = %s, has_two_years_experience = %s, experience_description = %s
        WHERE id = %s
    """
    cur.execute(query, (name, position, salary, has_agreed_to_upper_salary_range, registration_number, registration_state, expected_registration_date, has_two_years_experience, experience_description, conversation_id))
    conn.commit()
    cur.close()
    conn.close()
    return

def handle_conversation(conversation_id=None, request=None):
    data = request.get_json()
    if not data or 'content' not in data:
        return jsonify({
            'error': 'Message content is required',
            'status': 'error'
        }), 400

    # Create new message
    new_message = {
        'id': str(uuid.uuid4()),
        'content': data['content'],
        'role': 'user',
        'timestamp': datetime.utcnow().isoformat()
    }

    # If no conversation_id provided, create new conversation
    if not conversation_id:
        conversation_id = create_conversation()
        initial_message = {
            'id': str(uuid.uuid4()),
            'content': 'Hello! How can I help you today?',
            'role': 'assistant',
            'timestamp': datetime.utcnow().isoformat()
        }
        conversations[conversation_id] = [initial_message, new_message]
        
        # Generate AI response for new conversation
        ai_response = {
            'id': str(uuid.uuid4()),
            'content': 'This is a placeholder AI response. Implement actual AI logic here.',
            'role': 'assistant',
            'timestamp': datetime.utcnow().isoformat(),
            'stage': 'Stage 2',
            'status': 'active'
        }
        conversations[conversation_id].append(ai_response)
        
        return jsonify({
            'id': conversation_id,
            'messages': conversations[conversation_id],
            'status': 'success'
        })
    
    # If conversation_id provided, append to existing conversation
    if conversation_id not in conversations:
        return jsonify({
            'error': 'Conversation not found',
            'status': 'error'
        }), 404
    
    # Add message to conversation
    conversations[conversation_id].append(new_message)
    
    # Generate AI response
    ai_response = {
        'id': str(uuid.uuid4()),
        'content': 'This is a placeholder AI response. Implement actual AI logic here.',
        'role': 'assistant',
        'timestamp': datetime.utcnow().isoformat(),
        'stage': 'Stage 2',
        'status': 'active'
    }
    conversations[conversation_id].append(ai_response)
    
    return jsonify({
        'id': conversation_id,
        'messages': conversations[conversation_id],
        'status': 'success'
    }) 