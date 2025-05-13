import os
import psycopg2
from flask import Flask, jsonify, request
from conversation_handler import handle_conversation
from database_interactions import fetch_candidate_details

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
    print(cur)
    for row in cur:
        print(row)
        conversation = {
            'id': row[0], 
            'status': row[1], 
            'candidateName': row[2],  
            'desiredPosition': row[3],
            'desiredSalary': row[4],
            'hasAgreedToUpperSalaryRange': row[5],
            'registrationNumber': row[6],
            'registrationState': row[7],
            'expectedRegistrationDate': row[8],
            'hasTwoYearsExperience': row[9],
            'experienceDescription': row[11],
        }
        results.append(conversation)

    cur.close()
    conn.close()
    return jsonify(results)

@app.route('/api/conversations/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    conversation = fetch_candidate_details(conversation_id)
    if not conversation:
        return jsonify({
            'error': 'Conversation not found',
            'status': 'error'
        }), 404
    return conversation

@app.route('/api/conversations', methods=['POST'])
@app.route('/api/conversations/<conversation_id>', methods=['POST'])
def conversation_route(conversation_id=None):
    return handle_conversation(conversation_id, request)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 