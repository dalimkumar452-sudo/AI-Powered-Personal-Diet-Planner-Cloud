import random

def generate_diet_plan(profile):
    goal = profile.get("goal", "maintain")
    pref = profile.get("diet_pref", "veg")
    
    foods = {
        "veg": {
            "breakfast": ["Oats with Almond Milk", "Paneer Sandwich", "Poha with Peanuts", "Soy Milk & Banana"],
            "lunch": ["Dal, Rice, and Mixed Veg", "Quinoa Salad with Tofu", "Roti with Palak Paneer"],
            "dinner": ["Grilled Vegetable Salad", "Lentil Soup", "Mixed Veg Daliya"]
        },
        "nonveg": {
            "breakfast": ["Boiled Eggs & Toast", "Chicken Sausage Omelette", "Oats & Scrambled Eggs"],
            "lunch": ["Grilled Chicken Breast with Brown Rice", "Fish Curry with Rice", "Turkey Wrap"],
            "dinner": ["Baked Salmon with Asparagus", "Chicken Salad", "Egg Curry & Roti"]
        }
    }
    
    menu = foods.get(pref, foods["veg"])
    cal_multiplier = {"cut": 1800, "maintain": 2200, "gain": 2600}
    target_cals = cal_multiplier.get(goal, 2000)

    return {
        "calories": target_cals,
        "protein": f"{int(target_cals * 0.3 / 4)}g",
        "carbs": f"{int(target_cals * 0.4 / 4)}g",
        "fat": f"{int(target_cals * 0.3 / 9)}g",
        "breakfast": random.choice(menu["breakfast"]),
        "lunch": random.choice(menu["lunch"]),
        "dinner": random.choice(menu["dinner"]),
        "snack": "Handful of almonds or a fruit"
    }