from flask import jsonify
from datetime import datetime
import uuid
from database_interactions import create_conversation, fetch_candidate_details, save_conversation
from ai_bot import interviewer_bot

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
        'timestamp': datetime.now().isoformat(),
    }

    # If no conversation_id provided, create new conversation
    if not conversation_id:
        return handle_new_conversation(new_message)
    
    candidate_details = fetch_candidate_details(conversation_id)
    if not candidate_details:
        return jsonify({
            'error': 'Conversation not found',
            'status': 'error'
        }), 404
        
    candidate_data = candidate_details.get_json()
    conversation = [*candidate_data.get('messages', []), new_message]
    candidate_json = candidate_data.get('candidateProfile')

    ai_response = interviewer_bot(conversation, candidate_json)
    
    # Generate AI response
    ai_message = {
        'role': 'assistant',
        'content': ai_response.get("next_question"),
        'timestamp': datetime.now().isoformat(),
    }

    appended_conversation = [*conversation, ai_message]
    updated_candidate_profile = ai_response.get("candidate_profile")

    save_conversation(conversation_id, updated_candidate_profile.get("candidateName"), updated_candidate_profile.get("desiredPosition"), updated_candidate_profile.get("desiredSalary"), updated_candidate_profile.get("hasAgreedToUpperSalaryRange"), updated_candidate_profile.get("registrationNumber"), updated_candidate_profile.get("registrationState"), updated_candidate_profile.get("expectedRegistrationDate"), updated_candidate_profile.get("hasTwoYearsExperience"), updated_candidate_profile.get("experienceDescription"), ai_response.get("status"), appended_conversation)

    return jsonify({
        'id': conversation_id,
        'messages': appended_conversation,
        'candidate_profile': updated_candidate_profile,
        'status': ai_response.get("status"),
    })

def handle_new_conversation(new_message):
    initial_message = {
        'content': 'Hello! How can I help you today?',
        'role': 'assistant',
        'timestamp': datetime.now().isoformat()
    }

    current_conversation = [initial_message, new_message]

    bot_resp = interviewer_bot(current_conversation, {})
    next_question = {
        'content': bot_resp.get("next_question"),
        'role': 'assistant',
        'timestamp': datetime.now().isoformat()
    }
    candidate_profile = bot_resp.get("candidate_profile")
    status = bot_resp.get("status")
    current_conversation = [initial_message, new_message, next_question]

    conversation_id = create_conversation(current_conversation, candidate_profile.get("candidateName"), candidate_profile.get("desiredPosition"), candidate_profile.get("desiredSalary"), candidate_profile.get("hasAgreedToUpperSalaryRange"), candidate_profile.get("registrationNumber"), candidate_profile.get("registrationState"), candidate_profile.get("expectedRegistrationDate"), candidate_profile.get("hasTwoYearsExperience"), candidate_profile.get("experienceDescription"), status)
    
    return jsonify({
        'id': conversation_id,
        'status': 'success',
        'messages': current_conversation,
        'candidate_profile': candidate_profile,
    })