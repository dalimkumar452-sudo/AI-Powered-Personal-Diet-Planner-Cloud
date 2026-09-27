import React, { useState, useEffect } from 'react';
import { auth, storage } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import './index.css';

const API_URL = "http://localhost:8080/api";
const FOOD_DB = {
  'Oats': { cal: 379, p: 13, c: 67, f: 6 },
  'Paneer': { cal: 265, p: 18, c: 6, f: 20 },
  'Banana': { cal: 89, p: 1, c: 23, f: 0 },
  'Chicken': { cal: 165, p: 31, c: 0, f: 3 },
  'Rice': { cal: 130, p: 2, c: 28, f: 0 },
  'Egg': { cal: 155, p: 13, c: 1, f: 11 }
};

export default function App() {
  const [user, setUser] = useState(null);
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Student');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [plan, setPlan] = useState(null);
  const [intake, setIntake] = useState([]);
  const [foodInput, setFoodInput] = useState({ name: '', qty: '100' });
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '', age: '', sex: 'Female', height: '', weight: '',
    activity: 'Moderate', goal: 'Balanced / maintain', diet_pref: 'Vegetarian',
    budget: '', timeline: '', allergies: '', cuisines: '', photoURL: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        axios.get(`${API_URL}/profile/${currentUser.uid}`).then(res => {
          if (res.data && res.data.name) setProfile(res.data);
        }).catch(() => {});
        fetchIntake(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchIntake = async (uid) => {
    try {
      const res = await axios.get(`${API_URL}/intake/${uid}`);
      setIntake(res.data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return alert("Enter email and password");
    try {
      const res = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setUser(res.user);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regName) return alert("Please fill in all registration fields");
    try {
      const res = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      setUser(res.user);
      alert("Registration successful! Please login.");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setPlan(null);
      setIntake([]);
    } catch (err) {
      alert("Error signing out: " + err.message);
    }
  };

  const generatePlan = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/generate-plan`, { uid: user.uid, profile });
      setPlan(res.data.plan);
      setActiveTab('generate_plan');
    } catch (err) {
      alert("Failed to connect to backend server");
    }
    setLoading(false);
  };

  const savePlanToCloud = async () => {
    if (!plan || !user) return;
    await axios.post(`${API_URL}/save-plan`, { uid: user.uid, plan });
    alert("Plan saved to cloud successfully!");
  };

  const addFoodToIntake = async () => {
    if (!foodInput.name || !user) return;
    const qtyRatio = parseFloat(foodInput.qty) / 100;
    const foodData = FOOD_DB[foodInput.name] || { cal: 150, p: 5, c: 20, f: 5 };
    
    const item = {
      name: foodInput.name,
      qty: foodInput.qty,
      cal: Math.round(foodData.cal * qtyRatio),
      p: Math.round(foodData.p * qtyRatio),
      c: Math.round(foodData.c * qtyRatio),
      f: Math.round(foodData.f * qtyRatio)
    };
    await axios.post(`${API_URL}/intake`, { uid: user.uid, item });
    setFoodInput({ name: '', qty: '100' });
    fetchIntake(user.uid);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setLoading(true);
    try {
      const imageRef = ref(storage, `profiles/${user.uid}/${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setProfile({...profile, photoURL: url});
    } catch (err) {
      alert("Image upload failed. Ensure Firebase Storage is enabled.");
    }
    setLoading(false);
  };

  const totals = intake.reduce((acc, curr) => ({
    cal: acc.cal + curr.cal, p: acc.p + curr.p, c: acc.c + curr.c, f: acc.f + curr.f
  }), { cal: 0, p: 0, c: 0, f: 0 });

  const targets = { cal: 2139, p: 160, c: 214, f: 71 };

  if (!user) {
    return (
      <div className="auth-wrapper" style={{flexDirection: 'column', gap: '30px', padding: '40px 20px'}}>
        {/* Login Box */}
        <div className="auth-box">
          <h2>NutriCloud Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" className="input-field" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="input-field" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Login</button>
          </form>
        </div>

        {/* Register Box (Exactly as your screenshot) */}
        <div className="auth-box">
          <h2>Register New Account</h2>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Name" className="input-field" value={regName} onChange={e => setRegName(e.target.value)} />
            <input type="email" placeholder="Email" className="input-field" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="input-field" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            <select className="input-field" value={regRole} onChange={e => setRegRole(e.target.value)}>
              <option value="Student">Student</option>
              <option value="Professional">Professional</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit" className="btn" style={{width: '100%', background: '#166534', color: 'white'}}>Register</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div className="sidebar-brand">✦ NutriCloud</div>
        <div className="sidebar-menu">
          {['dashboard', 'profile', 'generate_plan', 'daily_intake', 'saved_plans'].map(tab => (
            <div key={tab} className={`menu-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.replace('_', ' ').charAt(0).toUpperCase() + tab.replace('_', ' ').slice(1)}
            </div>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="user-info-sidebar">
            <div className="sidebar-avatar" style={{ backgroundImage: `url(${profile.photoURL})` }}>
              {!profile.photoURL && user.email[0].toUpperCase()}
            </div>
            <div className="sidebar-user-details">
              <div className="sidebar-user-name">{profile.name || "User"}</div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
          </div>
          <button className="btn-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>

      <div className="main-content">
        {activeTab === 'dashboard' && (
          <>
            <div className="header">
              <div>
                <h1>Good to see you, {profile.name || "User"}.</h1>
                <p>Your cloud-backed planning overview</p>
              </div>
              <button className="btn btn-primary" onClick={generatePlan}>Generate plan</button>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-title">Daily calories</div><div className="stat-value">{targets.cal} <span style={{fontSize:'16px', color:'#64748b'}}>kcal</span></div></div>
              <div className="stat-card"><div className="stat-title">Protein target</div><div className="stat-value">{targets.p}g</div></div>
              <div className="stat-card"><div className="stat-title">Saved plans</div><div className="stat-value">1</div></div>
              <div className="stat-card"><div className="stat-title">Make today</div><div className="stat-value">{totals.cal} <span style={{fontSize:'16px', color:'#64748b'}}>kcal</span></div></div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <div className="header">
              <div><h1>Your profile</h1><p>These inputs shape the educational meal-plan examples.</p></div>
            </div>
            <div className="panel-card">
              <div className="panel-title">Basics</div>
              
              <div className="profile-upload-section">
                <div className="profile-img-preview" style={{ backgroundImage: `url(${profile.photoURL})`, backgroundColor: profile.photoURL ? 'transparent' : '#6366f1' }}>
                  {!profile.photoURL && user.email[0].toUpperCase()}
                </div>
                <div className="file-input-wrapper">
                  <button className="btn btn-secondary">{loading ? 'Uploading...' : 'Upload Image'}</button>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group"><label className="form-label">Name</label><input type="text" className="form-input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Age</label><input type="number" className="form-input" value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Sex</label><select className="form-select" value={profile.sex} onChange={e => setProfile({...profile, sex: e.target.value})}><option>Female</option><option>Male</option></select></div>
                <div className="form-group"><label className="form-label">Height (cm)</label><input type="number" className="form-input" value={profile.height} onChange={e => setProfile({...profile, height: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Weight (kg)</label><input type="number" className="form-input" value={profile.weight} onChange={e => setProfile({...profile, weight: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Activity</label><select className="form-select" value={profile.activity} onChange={e => setProfile({...profile, activity: e.target.value})}><option>Moderate</option><option>Light</option><option>Active</option></select></div>
                <div className="form-group"><label className="form-label">Goal</label><select className="form-select" value={profile.goal} onChange={e => setProfile({...profile, goal: e.target.value})}><option>Balanced / maintain</option><option>Weight loss</option><option>Muscle gain</option></select></div>
                <div className="form-group"><label className="form-label">Diet preference</label><select className="form-select" value={profile.diet_pref} onChange={e => setProfile({...profile, diet_pref: e.target.value})}><option>Vegetarian</option><option>Vegan</option><option>Non-Vegetarian</option></select></div>
                <div className="form-group"><label className="form-label">Budget per day</label><input type="number" className="form-input" value={profile.budget} onChange={e => setProfile({...profile, budget: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Timeline (weeks)</label><input type="number" className="form-input" value={profile.timeline} onChange={e => setProfile({...profile, timeline: e.target.value})} /></div>
                <div className="form-group full-width"><label className="form-label">Allergies / avoid (comma separated)</label><input type="text" className="form-input" value={profile.allergies} onChange={e => setProfile({...profile, allergies: e.target.value})} /></div>
                <div className="form-group full-width"><label className="form-label">Cuisine preferences (comma separated)</label><input type="text" className="form-input" value={profile.cuisines} onChange={e => setProfile({...profile, cuisines: e.target.value})} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={async () => { await axios.post(`${API_URL}/profile`, { uid: user.uid, profile }); alert("Profile Saved"); }}>Save profile</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'generate_plan' && (
          <>
             <div className="header">
              <div><h1>Generate a plan</h1><p>Create a structured meal plan example using your saved profile.</p></div>
              <button className="btn btn-primary" onClick={generatePlan}>{loading ? 'Generating...' : 'Generate plan'}</button>
            </div>
            {plan && (
              <>
                <div className="macro-top-cards">
                  <div className="stat-card"><div className="stat-title">Target</div><div className="stat-value">{plan.calories} <span style={{fontSize:'16px'}}>kcal</span></div></div>
                  <div className="stat-card"><div className="stat-title">Protein</div><div className="stat-value">{plan.protein}</div></div>
                  <div className="stat-card"><div className="stat-title">Carbs</div><div className="stat-value">{plan.carbs}</div></div>
                  <div className="stat-card"><div className="stat-title">Fat</div><div className="stat-value">{plan.fat}</div></div>
                </div>
                <div className="plan-container">
                  {['breakfast', 'lunch', 'snack', 'dinner'].map(meal => (
                    <div key={meal} className="meal-row">
                      <div className="meal-type">{meal}</div>
                      <div className="meal-desc">{plan[meal]}</div>
                    </div>
                  ))}
                </div>
                <div className="panel-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div className="panel-title" style={{marginBottom: '4px'}}>Save this plan</div>
                    <p style={{color: '#64748b', fontSize: '14px'}}>Save this plan permanently to your Firebase Cloud Firestore workspace.</p>
                  </div>
                  <button className="btn btn-primary" onClick={savePlanToCloud}>Save to cloud</button>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'daily_intake' && (
          <>
            <div className="header"><div><h1>Today's intake</h1><p>Log demo food entries and compare them with your estimated targets.</p></div></div>
            <div className="macro-top-cards">
              <div className="stat-card"><div className="stat-title">Consumed</div><div className="stat-value">{totals.cal} <span style={{fontSize:'16px'}}>kcal</span></div></div>
              <div className="stat-card"><div className="stat-title">Protein</div><div className="stat-value">{totals.p} g</div></div>
              <div className="stat-card"><div className="stat-title">Carbs</div><div className="stat-value">{totals.c} g</div></div>
              <div className="stat-card"><div className="stat-title">Fat</div><div className="stat-value">{totals.f} g</div></div>
            </div>
            <div className="intake-grid">
              <div className="panel-card">
                <div className="panel-title">+ Add food</div>
                <div style={{display: 'flex', gap: '16px', alignItems: 'flex-end'}}>
                  <div style={{flex: 1}}>
                    <label className="form-label">Food</label>
                    <input type="text" className="form-input" placeholder="Type or select food" value={foodInput.name} onChange={e => setFoodInput({...foodInput, name: e.target.value})} list="food-list" />
                    <datalist id="food-list">
                      {Object.keys(FOOD_DB).map(f => <option key={f} value={f} />)}
                    </datalist>
                  </div>
                  <div style={{flex: 1}}><label className="form-label">Quantity (grams)</label><input type="number" className="form-input" value={foodInput.qty} onChange={e => setFoodInput({...foodInput, qty: e.target.value})} /></div>
                  <button className="btn btn-primary" onClick={addFoodToIntake}>+ Add to intake</button>
                </div>
                <div style={{marginTop: '40px'}} className="panel-title">Intake entries</div>
                {intake.map((item, i) => (
                  <div key={i} className="intake-item-row">
                    <div><div style={{fontWeight: 600, color: '#0f172a'}}>{item.name}</div><div style={{color: '#64748b'}}>{item.qty} g</div></div>
                    <div style={{fontWeight: 600}}>{item.cal} kcal</div>
                  </div>
                ))}
              </div>
              <div className="panel-card">
                <div className="panel-title">Target progress</div>
                {Object.entries({Calories: [totals.cal, targets.cal], Protein: [totals.p, targets.p], Carbs: [totals.c, targets.c], Fat: [totals.f, targets.f]}).map(([label, [val, tgt]]) => (
                  <div key={label} className="progress-item">
                    <div className="progress-header"><span>{label}</span><span style={{color: '#64748b'}}>{val} / {tgt}</span></div>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: `${Math.min((val/tgt)*100, 100)}%`}}></div></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}