AI-Powered Personal Diet Planner with Cloud Storage
A modern, full-stack cloud application designed to solve personal meal-planning and nutrition-tracking challenges. The application provides goal-oriented AI meal planning, secure user authentication, centralized cloud database synchronization, object storage for user assets, and a daily macro/calorie tracking engine.

🚀 Overview
The AI-Powered Personal Diet Planner bridges the gap between nutrition and cloud computing. It allows users to manage their wellness profiles, generate customized meal recommendations based on fitness goals, track daily food intake with dynamic progress bars, and store data securely in the cloud.

The project demonstrates production-ready cloud concepts, modular architecture, and seamless client-server communication.

🛠️ Technology Stack
Frontend: React, Vite, CSS3 (Modern responsive UI with sidebar navigation)

Backend: Python, Flask, Flask-CORS

Cloud Database & Auth: Firebase Authentication, Cloud Firestore

Cloud Storage: Firebase Cloud Storage (Profile asset management)

AI/Heuristic Engine: Custom Python rule-based macro calculator and dynamic meal generator

🏗️ System Architecture
Plaintext
User 
  ↓
React Frontend (Vite)
  ↓
Firebase Authentication (Secure Token / Session)
  ↓
Python Flask REST API
  ↓
┌──────────────────────┬──────────────────────┬──────────────────────┐
↓                      ↓                      ↓                      │
AI/Heuristic Engine   Cloud Firestore        Firebase Storage        │
  ↓                    (User Profiles/Plans)  (Media / Assets)       │
Dashboard & Daily Intake Tracker
✨ Key Features
Secure Cloud Authentication: User registration, login, and protected workspace routing powered by Firebase Auth.

Personalized Profile Management: Collects user details (Name, Age, Height, Weight, Activity Level, Goals, Diet Preferences) and stores them securely in Firestore.

AI Diet Plan Generation: Dynamically calculates nutritional needs and generates structured daily meal plans (Breakfast, Lunch, Snack, Dinner) tailored to user goals (e.g., weight loss, maintenance).

Cloud Database Integration: Real-time data persistence for user profiles, generated plans, and intake logs.

Cloud Object Storage: Upload profile avatars or meal-related images directly to Firebase Cloud Storage.

Daily Intake & Macro Tracker: Interactive food logging system with automated calculation of consumed Calories, Protein, Carbs, and Fats against target progress bars.

Cloud Plan Archiving: Save generated plans permanently to the cloud workspace.

📂 Project Folder Structure
Plaintext
AI-Powered-Personal-Diet-Planner-Cloud/
│
├── backend/
│   ├── app.py                  # Main Flask REST API routes
│   ├── ai_engine.py            # Meal planning & macro logic
│   ├── cloud_services.py       # Firebase Admin & Firestore handlers
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment configurations
│   └── serviceAccountKey.json  # Cloud admin credentials (Ignored in git)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main React application & views
│   │   ├── firebase.js         # Firebase client configuration
│   │   └── index.css           # Professional dashboard styling
│   ├── package.json            # Node dependencies
│   └── index.html              # HTML entry point
│
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
⚙️ Installation & Local Setup
Prerequisites
Python 3.10+

Node.js & npm

Firebase Account (Firestore, Auth, and Storage enabled)

1. Clone the Repository
Bash
git clone https://github.com/dalimkumar452-sudo/AI-Powered-Personal-Diet-Planner-Cloud.git
cd AI-Powered-Personal-Diet-Planner-Cloud
2. Backend Setup
Bash
cd backend
python -m venv venv
# Windows PowerShell:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
Note: Place your downloaded Firebase serviceAccountKey.json file inside the backend/ folder.

Run the Flask server:

Bash
python app.py
(Backend runs on http://localhost:8080)

3. Frontend Setup
Open a new terminal window:

Bash
cd frontend
npm install
npm run dev
(Frontend runs on http://localhost:5173)

🔒 Security Best Practices
Secrets Management: Sensitive keys (serviceAccountKey.json, .env) are excluded from version control via .gitignore.

User Isolation: Firestore and storage rules restrict users to reading and writing solely within their own uid paths.

Input Validation: Client and server-side checks guard against unauthorized API calls.

📄 Disclaimer
This application is created for educational and general wellness demonstration purposes only. It does not provide clinical, medical, or professional nutritional diagnosis/advice.

👤 Author
Dalim Kumar

B.Tech Computer Science & Engineering (AI)

GitHub: dalimkumar452-sudo