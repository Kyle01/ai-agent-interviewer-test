from ai_bots import get_boolean_check
from datetime import datetime

def response_stage_1(message):
    if get_boolean_check("The answer is affirmative", message):
        return {
            'content': "Great! Let's get started. What is your name?",
            'role': 'assistant',
            'timestamp': datetime.utcnow().isoformat(),
            'stage': '2',
            'status': 'active'
        }
    else:
         return {
            'content': 'No problem. Best of luck!',
            'role': 'assistant',
            'timestamp': datetime.utcnow().isoformat(),
            'stage': '2',
            'status': 'completed'
        }

def handle_stage_2(conversation_id, request):
    return "Stage 2"

