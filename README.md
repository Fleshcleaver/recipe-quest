# 🍳 Recipe Quest

A full-stack gamified recipe tracker where users save their favorite recipes and earn XP every time they cook one. Level up through chef ranks as you build your cooking history.

## 🎮 How It Works

- Save your personal recipes to your cookbook
- Log a cook every time you make a recipe and earn **+25 XP**
- Level up through 5 chef ranks:
  - 🥄 Line Cook (Level 1–2)
  - 🍳 Home Chef (Level 3–5)
  - 👨‍🍳 Sous Chef (Level 6–9)
  - ⭐ Head Chef (Level 10–14)
  - 👑 Executive Chef (Level 15+)

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended
- **Database:** SQLite
- **Auth:** JWT (JSON Web Tokens)

## 📦 Features

- User registration and login with JWT authentication
- Protected routes — only logged-in users can access the app
- Full recipe CRUD (create, read, update, delete)
- Cook log with date and notes
- XP and leveling system tied to cook logs
- Chef rank ladder displayed on the dashboard
- Each user only sees their own recipes and cook logs

## 🚀 Setup Instructions

### Prerequisites
- Python 3.x
- Node.js + npm

### Backend Setup
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP="app:create_app"
flask db init
flask db migrate -m "initial models"
flask db upgrade
python app.py
```

The backend will run on `http://localhost:5555`

### Frontend Setup

Open a new terminal:
```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure
```
recipe-quest/
├── server/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── models.py
│   ├── requirements.txt
│   └── routes/
│       ├── auth.py
│       ├── recipes.py
│       └── cook_logs.py
└── client/
    └── src/
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Recipes.jsx
            ├── RecipeDetail.jsx
            └── CookLog.jsx
```

## 🔐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/register | No | Register a new user |
| POST | /api/login | No | Login and receive JWT |
| GET | /api/me | Yes | Get current user info |
| GET | /api/recipes | Yes | Get all recipes for user |
| POST | /api/recipes | Yes | Create a new recipe |
| GET | /api/recipes/:id | Yes | Get a single recipe |
| PATCH | /api/recipes/:id | Yes | Update a recipe |
| DELETE | /api/recipes/:id | Yes | Delete a recipe |
| GET | /api/cook-logs | Yes | Get all cook logs for user |
| POST | /api/cook-logs | Yes | Log a cook (+25 XP) |
| DELETE | /api/cook-logs/:id | Yes | Delete a cook log |