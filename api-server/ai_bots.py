import os
import openai
from dotenv import load_dotenv
import json
import re

load_dotenv() 

def get_boolean_check(question, response):
    openai_client = openai.Client(api_key=os.getenv('OPENAI_API_KEY'))
    resp = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system", 
                "content": """
                    You are an equalizer engine that reads a question and determines if the answer is true or false.
                    You will only respond with "True" or "False" and nothing else.
                    Please be approximate in your equalization check.
                """
            },
            {
                "role": "user",
                "content": f"Given the question: {question}, and the answer: {response}, is the answer True or False?"
            }
        ],
    )

    boolean_string = resp.choices[0].message.content
    return boolean_string == "True"

def interviewer_bot(conversation, candidate_profile):
    openai_client = openai.Client(api_key=os.getenv('OPENAI_API_KEY'))
    resp = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system", 
                "content": """
                    You are an interviewer bot that asks questions to the user in an attempt to complete a json on their behalf.
                    You will always respond with three pieces of information as a json object:
                    1. candidate_profile: The current state of the JSON you're completing.
                    2. status: The Status of the application, whether it be completed, rejected, or in_progress.
                    3. next_question: The next question to ask if applicable.
                    The json you're trying to complete is the following:
                    {
                        "candidateName": "",
                        "desiredPosition": "",
                        "desiredSalary": "",
                        "hasAgreedToUpperSalaryRange": "",
                        "registrationNumber": "",
                        "registrationState": "",
                        "expectedRegistrationDate": "",
                        "hasTwoYearsExperience": "",
                        "experienceDescription": ""
                    }
                    You should reject the application if the candidate is not looking for work.
                    You should reject the application if the desired role is not related to nursing.
                    You should reject the application if the desired salary range is dramatically out of line with upper salary range, which is $72,000 a year.
                    You should reject the application if the candidate has not agreed to the upper salary range, which is $72,000 a year.
                    If the candidate is rejected you should thank them for their time.
                    You should be polite and professional in our conversation seeking information for the JSON.
                """
            },
            {
                "role": "user",
                "content": f"Given the state of the conversation {conversation} and the current state of the JSON {candidate_profile}, provide the status, and update the JSON, provide the next question to ask."
            }
        ],
    )
    match = re.search(r'```json\n(.*?)\n```', resp.choices[0].message.content, re.DOTALL)
    json_string = match.group(1)
    bot_response = json.loads(json_string)
    candidate_profile = bot_response.get("candidate_profile")
    status = bot_response.get("status")
    next_question = bot_response.get("next_question")
    return {
        "candidate_profile": candidate_profile,
        "status": status,
        "next_question": next_question,
    }