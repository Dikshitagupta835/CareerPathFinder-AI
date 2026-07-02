import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';
import { 
  Map, Play 
} from 'lucide-react';

interface Milestone {
  id: number;
  step: string;
  duration: string;
  description: string;
  skillsNeeded: string[];
  recommendedCourses: string[];
  cost: string;
  salary: string;
  status: 'completed' | 'active' | 'upcoming';
}

export const Roadmap: React.FC = () => {
  const { recommendations, onboardingComplete, user } = useApp();
  const navigate = useNavigate();
  const [activeMilestoneId, setActiveMilestoneId] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    if (recommendations?.roadmap) {
      const formatted = recommendations.roadmap.map((m: any, idx: number) => ({
        id: idx,
        step: m.step || m.name,
        duration: m.duration || "Ongoing",
        description: m.description || "Target milestones to execute.",
        skillsNeeded: m.skillsNeeded || ["Domain Skill", "Problem Solving"],
        recommendedCourses: m.recommendedCourses || ["Online learning guides", "Certifications"],
        cost: m.cost || "Free resource",
        salary: m.salary || "N/A",
        status: m.status || "upcoming"
      }));
      setMilestones(formatted);
    }
  }, [recommendations]);

  const handleToggleComplete = (id: number) => {
    setMilestones(prev => 
      prev.map(m => {
        if (m.id === id) {
          const nextStatus = m.status === 'completed' ? 'active' : 'completed';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const activeMilestone = milestones.find(m => m.id === activeMilestoneId) || milestones[0];

  // Calculate percentages
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const careerProgress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  if (!onboardingComplete || milestones.length === 0) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <Map size={22} className="text-brand-primary" /> Personalized Career Roadmap
          </h2>
          <p className="text-xs text-slate-400">Step-by-step milestones to help you transition into your target career.</p>
        </div>

        <EmptyState
          illustration={
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          }
          heading="No roadmap yet 🗺"
          subtext="Complete Career Discovery so AI can build your personalized step-by-step plan."
          buttonText="Start Career Discovery"
          onButtonClick={() => navigate('/onboarding')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <Map size={22} className="text-brand-primary" /> Personalized Career Roadmap
          </h2>
          <p className="text-xs text-slate-400">Milestone timeline dynamically curated for {user?.name || 'your'}'s goal: **{recommendations?.careers?.[0]?.name || 'Target Career'}**</p>
        </div>
      </div>

      {/* Today's Goal Banner & Progress circles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Daily recommendation */}
        <GlassCard className="p-4 flex gap-4 border-indigo-500/10 dark:border-indigo-400/5 bg-indigo-550/[0.01] items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
            <Play size={18} className="fill-current ml-0.5" />
          </div>
          <div>
            <span className="text-[10px] text-indigo-500 font-bold uppercase block tracking-wider">AI Daily Recommended Task</span>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 mt-0.5">Learn Excel Reconciliations — 30 Minutes</h4>
            <p className="text-[10px] text-slate-400">Improves CA articleship recruitment odds by 18%.</p>
          </div>
        </GlassCard>

        {/* Circular Progress representation */}
        <GlassCard className="lg:col-span-2 p-4 grid grid-cols-3 gap-4 text-center items-center divide-x divide-slate-100 dark:divide-slate-800">
          <div>
            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-heading">{careerProgress}%</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Overall Completion</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-purple-500 font-heading">35%</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Skills Readiness</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-500 font-heading">10%</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Education Progress</p>
          </div>
        </GlassCard>

      </div>

      {/* Main Roadmap Timeline grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Clickable Vertical Timeline */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 transition-colors">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Roadmap Milestones</h3>
          
          <div className="relative pl-6 space-y-5 border-l-2 border-slate-100 dark:border-slate-800">
            {milestones.map((m) => (
              <div 
                key={m.id}
                onClick={() => setActiveMilestoneId(m.id)}
                className={`cursor-pointer group relative py-1 px-2.5 rounded-lg transition-all ${
                  activeMilestoneId === m.id 
                    ? 'bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700' 
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Timeline Dot */}
                <span className={`absolute -left-[31px] top-2.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center transition-colors ${
                  m.status === 'completed' 
                    ? 'border-emerald-500 text-emerald-500' 
                    : m.status === 'active' 
                      ? 'border-indigo-500 text-indigo-500' 
                      : 'border-slate-300 dark:border-slate-700 text-slate-300'
                }`}>
                  {m.status === 'completed' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  {m.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </span>
                
                <h4 className={`text-xs ${
                  m.status === 'completed' 
                    ? 'text-slate-400 line-through' 
                    : m.status === 'active' 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {m.step}
                </h4>
                <span className="text-[9px] text-slate-400 font-medium block mt-0.5">{m.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Active Milestone Detail Card */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-6 space-y-5 border-l-4 border-l-brand-primary h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] text-indigo-550 font-bold uppercase tracking-wider block">Active Selection Details</span>
                  <h3 className="text-base font-bold font-heading mt-0.5">{activeMilestone.step}</h3>
                </div>
                <button
                  onClick={() => handleToggleComplete(activeMilestone.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    activeMilestone.status === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-350'
                  }`}
                >
                  {activeMilestone.status === 'completed' ? '✓ Completed' : 'Mark Completed'}
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">{activeMilestone.description}</p>

              {/* Grid properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Skills Required:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeMilestone.skillsNeeded.map(s => (
                      <span key={s} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Recommended Courses:</span>
                  <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-0.5 text-[10px]">
                    {activeMilestone.recommendedCourses.map(c => (
                      <li key={c} className="truncate">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Price / Salary bar */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl flex items-center justify-between text-xs font-semibold border border-slate-100 dark:border-slate-850 mt-6 transition-colors">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Est Expenditure</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold">{activeMilestone.cost}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[9px] uppercase">Expected Salary/Stipend</span>
                <span className="text-emerald-500 font-bold">{activeMilestone.salary}</span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
