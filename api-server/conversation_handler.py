from flask import jsonify
from datetime import datetime
import uuid
from database_interactions import create_conversation
from ai_bots import interviewer_bot


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
    new_message = {
        'id': str(uuid.uuid4()),
        'content': data['content'],
        'role': 'user',
        'timestamp': datetime.utcnow().isoformat()
    }

    # If no conversation_id provided, create new conversation
    if not conversation_id:
        return handle_new_conversation(new_message)
    
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

def handle_new_conversation(new_message):
    initial_message = {
        'content': 'Hello! How can I help you today?',
        'role': 'assistant',
        'timestamp': datetime.utcnow().isoformat()
    }

    current_conversation = [initial_message, new_message]

    bot_resp = interviewer_bot(current_conversation, {})

    print(bot_resp)

    conversation_id = create_conversation([initial_message, new_message])
    
    return jsonify({
        'id': conversation_id,
        'status': 'success'
    })