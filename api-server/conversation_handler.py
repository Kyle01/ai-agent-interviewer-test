from flask import jsonify
from datetime import datetime
import uuid
from stage_manager import response_stage_1, response_stage_2

# In-memory storage for conversations
conversations = {}

def handle_conversation(conversation_id=None, request=None):
    data = request.get_json()
    if not data or 'content' not in data:
        return jsonify({
            'error': 'Message content is required',
            'status': 'error'
        }), 400

    # Create new message
    content = data['content']
    new_message = {
        'id': str(uuid.uuid4()),
        'content': content,
        'role': 'user',
        'timestamp': datetime.utcnow().isoformat(),
        'status': 'active',
        'stage': data['stage']
    }

    # If no conversation_id provided, create new conversation
    if not conversation_id:
        conversation_id = str(uuid.uuid4())
        initial_message = {
            'id': str(uuid.uuid4()),
            'content': 'Hello! Are you currently open to discussing this role?',
            'role': 'assistant',
            'timestamp': datetime.utcnow().isoformat()
        }
        conversations[conversation_id] = [initial_message, new_message]
        
        response = response_stage_1(content)
        conversations[conversation_id].append(response)
        
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
    
    if conversations[conversation_id][-1]['stage'] == '1':
        response = response_stage_1(content)
        conversations[conversation_id].append(response)
    elif conversations[conversation_id][-1]['stage'] == '2':
        response = response_stage_2(content)
        conversations[conversation_id].append(response)

    
    return jsonify({
        'id': conversation_id,
        'messages': conversations[conversation_id],
        'status': 'success'
    }) 