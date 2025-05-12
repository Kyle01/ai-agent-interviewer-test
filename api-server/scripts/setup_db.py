import os
import psycopg2
from dotenv import load_dotenv

load_dotenv() 

DB_CONNECTION_URL = os.environ.get('DB_CONNECTION_URL')
conn = psycopg2.connect(DB_CONNECTION_URL)

cur = conn.cursor()

cur.execute('DROP TABLE IF EXISTS candidate_applications;')
cur.execute('CREATE TABLE candidate_applications (id uuid PRIMARY KEY,'
                                 'status varchar,'
                                 'candidate_name varchar,'
                                 'desired_position varchar,'
                                 'desired_salary varchar,'
                                 'has_agreed_to_upper_salary_range varchar,'
                                 'registration_number varchar,'
                                 'registration_state varchar,'
                                 'expected_registration_date varchar,'
                                 'has_two_years_experience varchar,'
                                 'conversation jsonb,'
                                 'experience_description varchar);'
                                 )

conn.commit()

cur.close()
conn.close()

