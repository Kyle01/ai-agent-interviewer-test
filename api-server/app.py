import os
import psycopg2
from flask import Flask, jsonify, request
from conversation_handler import handle_conversation, conversations

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
        FROM conversations
    """
    cur.execute(query)
    conversations = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(conversations)

@app.route('/api/conversation/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    if conversation_id not in conversations:
        return jsonify({
            'error': 'Conversation not found',
            'status': 'error'
        }), 404
    
    return jsonify({
        'id': conversation_id,
        'messages': conversations[conversation_id],
        'status': 'success'
    })

@app.route('/api/conversation', methods=['POST'])
@app.route('/api/conversation/<conversation_id>', methods=['POST'])
def conversation_route(conversation_id=None):
    return handle_conversation(conversation_id, request)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 