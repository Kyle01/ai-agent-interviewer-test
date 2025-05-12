import os
import psycopg2
from flask import Flask, jsonify, request
from conversation_handler import handle_conversation
from database_interactions import fetch_conversation

app = Flask(__name__)

def get_db_connection():
    DB_CONNECTION_URL = os.environ.get('DB_CONNECTION_URL')
    conn = psycopg2.connect(DB_CONNECTION_URL)
    return conn


@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({
        'message': 'Hello from the test endpoint!',
        'status': 'success'
    })

@app.route('/api/conversations', methods=['GET'])
def get_conversations():
    conn = get_db_connection()
    cur = conn.cursor()
    query = """
        SELECT *
        FROM candidate_applications 
    """
    cur.execute(query)
    results = []
    for row in cur:
        conversation = {
            "id": row[0],
            "name": row[1],
            "position": row[2],
            "salary": row[3],
            "has_agreed_to_upper_salary_range": row[4],
            "registration_number": row[5],
            "registration_state": row[6],
            "expected_registration_date": row[7],
            "has_two_years_experience": row[8],
            "experience_description": row[9],
        }
        results.append(conversation)

    cur.close()
    conn.close()
    return jsonify(results)

@app.route('/api/conversations/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    conversation = fetch_conversation(conversation_id)
    if not conversation:
        return jsonify({
            'error': 'Conversation not found',
            'status': 'error'
        }), 404
    return conversation

@app.route('/api/conversation', methods=['POST'])
@app.route('/api/conversation/<conversation_id>', methods=['POST'])
def conversation_route(conversation_id=None):
    return handle_conversation(conversation_id, request)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 