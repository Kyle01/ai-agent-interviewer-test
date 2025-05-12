from flask import Flask, jsonify, request
from conversation_handler import handle_conversation, conversations
from datetime import datetime
import uuid

app = Flask(__name__)

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({
        'message': 'Hello from the test endpoint!',
        'status': 'success'
    })

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
    return handle_conversation(conversation_id)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 