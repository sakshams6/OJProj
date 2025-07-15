Online Judge App (MERN + Docker + Compiler Service)
A full-stack Online Judge platform built using the MERN stack, with support for code compilation, AI-powered hints and code reviews, authentication, and persistent progress tracking across sessions.

Features:

User authentication (Register/Login)

Problem listing with difficulty, tags & filters

Code editor with C++ & Python support

Run code with custom input

Submit code and check against multiple test cases

Track solved/unsolved problems

Progress dashboard with charts & submission history

AI Assistant: Get code reviews and smart hints

Full light/dark mode support

Fully Dockerized

Project Structure:

docker-compose.yml

oj-auth-backend/ (Node.js/Express backend)

models/

routes/

controllers/

OJ/ (React frontend - Vite + Tailwind)

src/

public/

nginx.conf (Nginx config to proxy /api)

compiler-service/ (Code compiler server)

mongo_data/ (Docker volume for MongoDB)

Getting Started:

Prerequisites:

Docker and Docker Compose

(Optional for local dev): Node.js, npm, and MongoDB

Run With Docker:
docker-compose down
docker-compose up --build

Access:

Frontend: http://localhost:3000

Backend API: http://localhost:5050

MongoDB: mongodb://localhost:27017/ojdb

Run Locally (Dev Mode):

Frontend (React):
cd OJ
npm install
npm run dev

Backend (Express):
cd oj-auth-backend
npm install
npm run dev

Compiler Service:
cd compiler-service
npm install
npm start

Environment Variables:
Create a .env file in oj-auth-backend/ with the following:

PORT=5050
MONGO_URI=mongodb://localhost:27017/ojdb
JWT_SECRET=supersecret123
GEMINI_API_KEY=your_gemini_api_key_here

Note: Never commit .env to GitHub.

AI Features:

POST /api/code-review → Gemini-based code review

POST /api/get-hint → Gemini-powered problem hints

Requires a valid Gemini 1.5 API key.

Tech Stack:

Frontend: React, Vite, Tailwind CSS

Backend: Express.js, MongoDB

Compiler: Node.js with Docker (C++/Python)

AI: Gemini API

Proxy: Nginx

DevOps: Docker, Docker Compose

Deployment Notes:

Build frontend: cd OJ && npm run build

The output is served via NGINX from /usr/share/nginx/html

Nginx config proxies /api routes to backend at http://backend:5050

TODO:

Add Java/JS support

Admin dashboard

Contest and leaderboard feature

CI/CD with GitHub Actions

Author:
Saksham Singh

License:
MIT License