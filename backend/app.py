from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_engine import generate_diet_plan
from cloud_services import save_user_profile, get_user_profile, save_diet_plan, get_user_plans, log_daily_intake, get_daily_intake

app = Flask(__name__)
CORS(app)

@app.route('/api/profile/<uid>', methods=['GET'])
def fetch_profile(uid):
    return jsonify(get_user_profile(uid)), 200

@app.route('/api/profile', methods=['POST'])
def update_profile():
    data = request.json
    save_user_profile(data.get("uid"), data.get("profile"))
    return jsonify({"message": "Success"}), 200

@app.route('/api/generate-plan', methods=['POST'])
def create_plan():
    data = request.json
    plan = generate_diet_plan(data.get("profile", {}))
    return jsonify({"plan": plan}), 200

@app.route('/api/save-plan', methods=['POST'])
def store_plan():
    data = request.json
    save_diet_plan(data.get("uid"), data.get("plan"))
    return jsonify({"message": "Saved"}), 200

@app.route('/api/intake/<uid>', methods=['GET'])
def fetch_intake(uid):
    return jsonify({"items": get_daily_intake(uid)}), 200

@app.route('/api/intake', methods=['POST'])
def add_intake():
    data = request.json
    log_daily_intake(data.get("uid"), data.get("item"))
    return jsonify({"message": "Success"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)