import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';
import { 
  Award, ShieldAlert, Sparkles, ExternalLink 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';

export const SkillGap: React.FC = () => {
  const { onboardingComplete, recommendations } = useApp();
  const navigate = useNavigate();
  const [providerFilter, setProviderFilter] = useState('All');

  const skillData = [
    { name: 'Excel Basics', current: 90, required: 95 },
    { name: 'Accounting Principles', current: 85, required: 90 },
    { name: 'Communication', current: 75, required: 80 },
    { name: 'Taxation / Compliance', current: 10, required: 85 },
    { name: 'Auditing Standards', current: 5, required: 90 },
    { name: 'Financial Modelling', current: 20, required: 80 }
  ];

  const certifications = [
    { title: "Advanced Financial Reporting & Audit", provider: "Coursera", duration: "6 Weeks", level: "Intermediate", rating: 4.8 },
    { title: "Direct & Indirect Taxes in India", provider: "NPTEL", duration: "12 Weeks", level: "Advanced", rating: 4.7 },
    { title: "Advanced Excel for Auditing", provider: "Coursera", duration: "3 Weeks", level: "Beginner", rating: 4.9 },
    { title: "Microsoft Certified: Power BI Data Analyst", provider: "Microsoft", duration: "4 Weeks", level: "Intermediate", rating: 4.6 },
    { title: "Introduction to Corporate Finance", provider: "Udemy", duration: "5 Hours", level: "Beginner", rating: 4.5 }
  ];

  const providersList = ['All', 'Coursera', 'NPTEL', 'Microsoft', 'Udemy'];
  const filteredCerts = providerFilter === 'All' 
    ? certifications 
    : certifications.filter(c => c.provider === providerFilter);

  const topCareerName = recommendations?.careers?.[0]?.name || "Chartered Accountant";
  const readiness = recommendations?.skills?.readiness || 70;

  if (!onboardingComplete) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <Award size={22} className="text-brand-primary" /> Skill Gap & Readiness Analysis
          </h2>
          <p className="text-xs text-slate-400">Review your current skill competencies relative to target career requirements.</p>
        </div>

        <EmptyState
          illustration={
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          heading="Choose a target career to see your skill gaps 🎯"
          subtext="Map your skills and build a custom learning path."
          buttonText="Select a Target Career"
          onButtonClick={() => navigate('/onboarding')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
          <Award size={22} className="text-brand-primary" /> Skill Gap & Readiness Analysis
        </h2>
        <p className="text-xs text-slate-400">Review your current skill competencies relative to **{topCareerName}** requirements.</p>
      </div>

      {/* Row 1: Competence charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Radial Chart */}
        <GlassCard className="p-5 flex flex-col justify-between items-center text-center">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider self-start">Career Readiness Score</h4>
          
          <div className="w-48 h-48 relative flex items-center justify-center">
            {/* Circular representation fallback or SVG radial gauge */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <h2 className="text-3xl font-bold text-brand-primary font-heading">{readiness}%</h2>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Ready</span>
            </div>
            <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
              <circle cx="50" cy="50" r="40" stroke="#4F46E5" strokeWidth="6" fill="transparent" 
                      strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * readiness) / 100} strokeLinecap="round" />
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 font-semibold space-y-1">
            <p>Skill Gap: <span className="text-rose-500 font-bold">{100 - readiness}%</span></p>
            <p>Subject Readiness: High • Professional Credentials: Low</p>
          </div>
        </GlassCard>

        {/* Side by side bar comparison chart */}
        <GlassCard className="lg:col-span-2 p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required vs Current Competency %</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" name="Your Level %" fill="#7C3AED" radius={[3, 3, 0, 0]} />
                <Bar dataKey="required" name="CA Target Level %" fill="#E2E8F0" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

      {/* Row 2: Missing skills highlights & AI advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Missing Skills card */}
        <GlassCard className="p-4 space-y-3 border-l-4 border-l-brand-danger">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><ShieldAlert size={14} className="text-brand-danger" /> Missing Target Skills</h4>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>**Taxation Laws** (85% required vs 10% current)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>**Statutory Auditing** (90% required vs 5% current)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>**Financial Modelling** (80% required vs 20% current)</span>
            </li>
          </ul>
        </GlassCard>

        {/* AI Recommendations Learning Path */}
        <GlassCard className="md:col-span-2 p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><Sparkles size={14} className="text-brand-primary" /> AI Recommended Upskilling Path</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
              <h5 className="font-bold text-indigo-500 block">Phase 1 (30 Days)</h5>
              <p className="text-[10px] text-slate-400 mt-1">Enroll in Advanced Excel for Audit. Complete 5 Practice sheets.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
              <h5 className="font-bold text-indigo-500 block">Phase 2 (45 Days)</h5>
              <p className="text-[10px] text-slate-400 mt-1">Learn Corporate Taxation laws on NPTEL platform. Clear basics.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
              <h5 className="font-bold text-indigo-500 block">Phase 3 (15 Days)</h5>
              <p className="text-[10px] text-slate-400 mt-1">Take Public Speaking or debate modules. Boost audit review presentation skills.</p>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Row 3: Certifications Explorer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Professional Certifications</h3>
          
          {/* Provider Filter buttons */}
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            {providersList.map(p => (
              <button
                key={p}
                onClick={() => setProviderFilter(p)}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  providerFilter === p 
                    ? 'bg-white dark:bg-slate-750 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Certs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert, idx) => (
            <div 
              key={idx}
              className="glass-panel p-4 rounded-xl flex flex-col justify-between hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all border border-slate-200/50 dark:border-slate-800/50"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{cert.provider}</span>
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{cert.level}</span>
                </div>
                <h4 className="font-bold text-slate-850 dark:text-slate-100 text-xs font-heading">{cert.title}</h4>
                <p className="text-[10px] text-slate-450 mt-1">Duration: {cert.duration} • Student Rating: ⭐ {cert.rating}</p>
              </div>
              <button 
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-100 hover:bg-indigo-500 hover:text-white dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-350 transition-colors"
                onClick={() => window.open('https://coursera.org', '_blank')}
              >
                View Course <ExternalLink size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
