import React, { useState } from 'react';
import { useApp, UserProfile } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Settings as SettingsIcon, Save, Download, 
  Trash2, Moon, Sun, ShieldAlert, User 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, updateUser, darkMode, setDarkMode, syncUser } = useApp();
  const [profile, setProfile] = useState<UserProfile>({ ...user });
  const [aiStyle, setAiStyle] = useState('Balanced');
  const [currency, setCurrency] = useState('INR');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profile);
    alert("Profile settings synchronized successfully! Recommendations have been updated.");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your profile details to a blank state? This will clear all onboarding selections.")) {
      const initialProfile = {
        name: "",
        age: 18,
        educationLevel: "",
        degree: "",
        subjects: [],
        skills: [],
        budget: 0,
        preferredCountry: "",
        familyIncome: 0,
        marks: "",
        interests: [],
        careerGoals: []
      };
      setProfile(initialProfile);
      
      syncUser({
        profile: initialProfile,
        onboardingComplete: false,
        onboardingStep: 0,
        savedCareers: [],
        savedColleges: [],
        savedScholarships: [],
        chatHistory: [],
        recommendations: null
      }).then(() => {
        alert("Your profile and saved records have been cleared completely!");
        window.location.reload();
      });
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "cpf_profile_backup.json");
    dlAnchorElem.click();
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
          <SettingsIcon size={22} className="text-brand-primary" /> Settings & Customizations
        </h2>
        <p className="text-xs text-slate-400">Modify your academic goals, budget caps, layout preferences, and configure the AI Coach's personality.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Profile settings form */}
        <div className="lg:col-span-2">
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><User size={14} /> Edit Student Profile</h3>
            
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-450 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-450 block mb-1">Age</label>
                <input 
                  type="number" 
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseFloat(e.target.value) })}
                  className="w-full bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-450 block mb-1">Education Level</label>
                <input 
                  type="text" 
                  value={profile.educationLevel}
                  onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-450 block mb-1">Current Degree Track</label>
                <input 
                  type="text" 
                  value={profile.degree}
                  onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-450 block mb-1">Target Country</label>
                <input 
                  type="text" 
                  value={profile.preferredCountry}
                  onChange={(e) => setProfile({ ...profile, preferredCountry: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-450 block mb-1">Education Budget Limit (₹)</label>
                <input 
                  type="number" 
                  value={profile.budget}
                  onChange={(e) => setProfile({ ...profile, budget: parseFloat(e.target.value) })}
                  className="w-full bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 focus:outline-none" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-450 block mb-1">Interests (comma separated)</label>
                <input 
                  type="text" 
                  value={profile.interests.join(', ')}
                  onChange={(e) => setProfile({ ...profile, interests: e.target.value.split(',').map(x => x.trim()) })}
                  className="w-full bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 focus:outline-none" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-450 block mb-1">Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={profile.skills.join(', ')}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(x => x.trim()) })}
                  className="w-full bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-250 focus:outline-none" 
                />
              </div>
              <button type="submit" className="sm:col-span-2 btn-primary py-2.5 flex items-center justify-center gap-1 shadow mt-2">
                <Save size={14} /> Synchronize Profile changes
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Right Col: Preferences & Data management */}
        <div className="space-y-6">
          
          {/* Preferences card */}
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">🎨 System Preferences</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-450">Dark Mode Interface</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>

              <div>
                <label className="text-slate-450 block mb-1">AI Coach Personality Style</label>
                <select 
                  value={aiStyle} 
                  onChange={(e) => setAiStyle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border-none focus:outline-none text-slate-700 dark:text-slate-250"
                >
                  <option value="Detailed">Detailed & Comprehensive</option>
                  <option value="Balanced">Balanced & Professional</option>
                  <option value="Concise">Concise & Actionable</option>
                </select>
              </div>

              <div>
                <label className="text-slate-450 block mb-1">Local currency display</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border-none focus:outline-none text-slate-700 dark:text-slate-250"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Backup restore */}
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><ShieldAlert size={14} /> Data & Backup Management</h3>
            
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={handleExport}
                className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Export Backup JSON
              </button>
              <button 
                onClick={handleReset}
                className="w-full text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} /> Reset Profile to defaults
              </button>
            </div>
          </GlassCard>

        </div>

      </div>
    </div>
  );
};
