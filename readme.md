
# Project Description
Text based interview chatbot using LLM to screen candidates and collect information for a possible nursing role. The deployed site can be found here: https://ai-agent-interviewer-test.vercel.app/

# Technical Description
* The frontend is made in NextJS and written in Typescript
* The backend is a flask app and written in Python
* The database is a postgres database with a single table: `candidate_applications`

# Local Development
### Frontend 
1. Go to the frontend directort `$ cd web-app`
2. Install frontend packages `$ npm i `
3. Run frontend server `$ npm run dev`
4. Find server on http://localhost:3000/

### Backend
1. Please note the `env.example` file to see the required environmental variables. Clone this file using `$ cp -a example.env .env` and complete the variables. 
2. Go to the backend `$ cd api-server`
3. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate 
```
4. Install dependencies:
```bash
pip install -r requirements.txt
```
5. To run the server:
```bash
python app.py
```
6. The server will start at `http://localhost:5000`


# Deployment 
The frontend is a NextJS app deployed in [Vercel](https://vercel.com/). The backend is a Flask App and Deployed in [Render](https://render.com/). The Database is in Postgres and deployed in Render. All the code is in this repo on github and deploys automatically once merged into the main branch

# Follow up items:
1. For simplicity I made the `candidate_applications` SQL table variables all strings. This was to capture the data entered from the users in the 'raw' and allow maximum flexibility. In an ideal world we would have a second table with the data better transformed into correct types, such as boolean for fields like `has_two_years_experience`. 
2. I didn't use an ORM and already regret it. If I did this over I would lean more on a Python ORM or do the entire thing in Typescript. 
3. I had some trouble with the OpenAI bot- in particular the bot really struggled with the giving a final conversation once the agent has decided to reject the candidate. I.e. "Thank you for applying but right now you don't meet the criteria". Also the question that caused me the most trouble was the desired salary range and not being flexible enough. 
