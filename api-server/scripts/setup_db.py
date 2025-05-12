import os
import psycopg2
from dotenv import load_dotenv

load_dotenv() 

DB_CONNECTION_URL = os.environ.get('DB_CONNECTION_URL')
conn = psycopg2.connect(DB_CONNECTION_URL)

cur = conn.cursor()

cur.execute('DROP TABLE IF EXISTS conversations;')
cur.execute('CREATE TABLE conversations (id serial PRIMARY KEY,'
                                 'status varchar,'
                                 'candidate_name varchar,'
                                 'desiired_position varchar,'
                                 'desired_salary integer,'
                                 'has_agreed_to_upper_salary_range boolean,'
                                 'registration_number varchar,'
                                 'registration_state varchar,'
                                 'expected_registration_date varchar,'
                                 'has_two_years_experience boolean,'
                                 'experience_description varchar);'
                                 )

conn.commit()

cur.close()
conn.close()