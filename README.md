🐞 Bug Reporting System

A full-stack Bug Reporting System built with Django REST Framework and React.

🚀 Overview

This project allows teams to manage projects and track issues effectively.

Features:

🔑 User authentication (JWT)

📂 Project management (create, list, view projects)

🐛 Issue management (create, update, filter issues per project)

💬 Comment system

📘 API documentation with Swagger UI

📂 Tech Stack

Backend: Django, Django REST Framework, SimpleJWT, drf-yasg

Frontend: React, Axios, React Router, Tailwind CSS (for styling)

Database: SQLite (development), can be replaced with PostgreSQL/MySQL in production

Deployment: Render/Heroku (backend), Vercel/Netlify (frontend)

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/USERNAME/bug-reporting-system.git
cd bug-reporting-system

2️⃣ Backend Setup (Django)
cd backend
python -m venv .venv
.\.venv\Scripts\activate   # (Windows)
# source .venv/bin/activate  # (Mac/Linux)

pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start backend
python manage.py runserver


📌 Backend runs on: http://127.0.0.1:8000/

📌 Swagger API Docs: http://127.0.0.1:8000/swagger/

3️⃣ Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev


📌 Frontend runs on: http://127.0.0.1:5173/

🔐 Authentication

Login Endpoint: POST /api/auth/login/

Payload:

{
  "username": "yourusername",
  "password": "yourpassword"
}


Response:

{
  "access": "JWT_ACCESS_TOKEN",
  "refresh": "JWT_REFRESH_TOKEN"
}


✅ Axios interceptors automatically attach the access token to requests and refresh it when expired.

🧪 Running Tests
cd backend
pytest

python manage.py test

📦 Docker (Upcoming)

A Dockerfile and docker-compose.yml will be added for containerized setup.

📄 License

MIT License

✨ Future Improvements

🎨 Tailwind CSS styling for polished UI

🌍 Backend & frontend deployment

🐳 Docker setup

⚡ CI/CD pipeline
