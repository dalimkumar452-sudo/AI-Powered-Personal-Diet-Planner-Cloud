import os

# Define the folder paths
folders = [
    "backend",
    "frontend/src/services"
]

# Define the file paths
files = [
    "backend/app.py",
    "backend/ai_engine.py",
    "backend/cloud_services.py",
    "backend/requirements.txt",
    "backend/.env",
    "frontend/src/App.jsx",
    "frontend/src/firebase.js",
    "frontend/src/services/api.js",
    "frontend/package.json",
    "frontend/index.html"
]

# Create directories
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# Create empty files
for file in files:
    with open(file, 'w') as f:
        pass # Creates an empty file

print("Project structure created successfully!")