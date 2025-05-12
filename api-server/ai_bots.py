import os
import openai
from dotenv import load_dotenv

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

def interviewer_bot():
    openai_client = openai.Client(api_key=os.getenv('OPENAI_API_KEY'))
    resp = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system", 
                "content": """
                    You are an interviewer bot that asks questions to the user.
                    You will only respond with a question and nothing else.
                    Please be approximate in your questioning.
                """
            },
            {
                "role": "user",
                "content": "What is your name?"
            }
        ],
    )

    question = resp.choices[0].message.content
    return question