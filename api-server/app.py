from flask import Flask, jsonify, request
from datetime import datetime
import uuid

app = Flask(__name__)

# In-memory storage for conversations
conversations = {}

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
def handle_conversation(conversation_id=None):
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
        conversation_id = str(uuid.uuid4())
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
            'timestamp': datetime.utcnow().isoformat()
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
        'timestamp': datetime.utcnow().isoformat()
    }
    conversations[conversation_id].append(ai_response)
    
    return jsonify({
        'id': conversation_id,
        'messages': conversations[conversation_id],
        'status': 'success'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000) 