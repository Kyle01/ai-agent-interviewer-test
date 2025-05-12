from ai_bots import get_boolean_check
from datetime import datetime

# stages: 
# 1: initial message
# 2: name question
# 3: position confirmation
# 4: salary
# 5: license question
# 6: experience questions  
# 7: ending questions

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

def response_stage_2(message):
    if get_boolean_check("Is the answer a name?", message):
        return {
            'content': f"Nice to meet you, {message}! What position are you applying for?",
            'role': 'assistant',
            'timestamp': datetime.utcnow().isoformat(),
            'stage': '3',
            'status': 'active'
        }
    else:
         return {
            'content': "I'm a bit confused, let's try again. What is your name?",
            'role': 'assistant',
            'timestamp': datetime.utcnow().isoformat(),
            'stage': '2',
            'status': 'active'
        }

