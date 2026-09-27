import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

cred = credentials.Certificate("serviceAccountKey.json")
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred)

db = firestore.client()

def save_user_profile(uid, profile_data):
    db.collection("users").document(uid).collection("profile").document("main").set(profile_data, merge=True)
    return {"status": "success"}

def get_user_profile(uid):
    doc = db.collection("users").document(uid).collection("profile").document("main").get()
    return doc.to_dict() if doc.exists else {}

def save_diet_plan(uid, plan_data):
    doc_ref = db.collection("users").document(uid).collection("plans").document()
    doc_ref.set(plan_data)
    return doc_ref.id

def get_user_plans(uid):
    docs = db.collection("users").document(uid).collection("plans").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in docs]

def log_daily_intake(uid, food_item):
    today = datetime.now().strftime("%Y-%m-%d")
    doc_ref = db.collection("users").document(uid).collection("intake").document(today)
    doc_ref.set({"items": firestore.ArrayUnion([food_item])}, merge=True)
    return {"status": "success"}

def get_daily_intake(uid):
    today = datetime.now().strftime("%Y-%m-%d")
    doc = db.collection("users").document(uid).collection("intake").document(today).get()
    return doc.to_dict().get("items", []) if doc.exists else []