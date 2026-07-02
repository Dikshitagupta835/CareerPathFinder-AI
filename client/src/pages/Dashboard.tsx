import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';
import { 
  Sparkles, Search, Compass, GitCompare, GraduationCap, DollarSign, 
  BarChart2, Globe, Map, FileText, ArrowUpRight, ArrowRight, BookmarkCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { 
    user, 
    recommendations, 
    savedCareers, 
    toggleSaveCareer, 
    setChatOpen, 
    sendChatMessage, 
    onboardingComplete,
    refreshRecommendations
  } = useApp();
  
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  // Fetch recommendations when user has onboarded but they are not loaded yet
  useEffect(() => {
    if (onboardingComplete && !recommendations) {
      refreshRecommendations();
    }
  }, [onboardingComplete, recommendations]);

  const quickActions = [
    { title: "Find Career", desc: "Interactive onboarding wizard", path: "/career-discovery", icon: Compass, color: "from-blue-500 to-indigo-500" },
    { title: "Compare Careers", desc: "Side-by-side matrices", path: "/career-comparison", icon: GitCompare, color: "from-purple-500 to-pink-500" },
    { title: "Explore Colleges", desc: "Global college matching", path: "/colleges", icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
    { title: "Scholarships", desc: "AI grants check", path: "/scholarships", icon: DollarSign, color: "from-amber-500 to-orange-500" },
    { title: "Salary Explorer", desc: "Pay trends & ROI calculator", path: "/salary-explorer", icon: BarChart2, color: "from-rose-500 to-red-500" },
    { title: "Study Abroad", desc: "Visa & PR comparison", path: "/countries", icon: Globe, color: "from-sky-500 to-indigo-500" },
    { title: "Career Roadmap", desc: "Milestone timeline", path: "/career-roadmap", icon: Map, color: "from-violet-500 to-purple-500" },
    { title: "AI Career Report", desc: "Export consolidated PDF", path: "/ai-report", icon: FileText, color: "from-fuchsia-500 to-rose-500" }
  ];

  if (!onboardingComplete) {
    return (
      <EmptyState
        illustration={
          <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        heading="Welcome to CareerPathFinder AI! 👋"
        subtext="Let's build your profile so the AI can find careers, colleges, and scholarships made for you."
        buttonText="Start Career Discovery 🚀"
        onButtonClick={() => navigate('/onboarding')}
      />
    );
  }

  const readiness = recommendations?.skills?.readiness || 70;
  const topCareerName = recommendations?.careers?.[0]?.name || "Chartered Accountant";

  const summaryCards = [
    { title: "Career Confidence", val: `${readiness + 8}%`, tip: "Climbed after updating skills profile.", progress: readiness + 8, color: "text-indigo-500", points: "0,10 5,20 10,5 15,22 20,8 25,12 30,5" },
    { title: "Skill Readiness", val: `${readiness}%`, tip: recommendations?.skills?.missingSkills?.length ? `Learn next: ${recommendations.skills.missingSkills[0]}` : "Skills synced with target career.", progress: readiness, color: "text-purple-500", points: "0,18 5,10 10,12 15,8 20,18 25,10 30,4" },
    { title: "Career Match Score", val: "96%", tip: `${topCareerName} is your best fit.`, progress: 96, color: "text-emerald-500", points: "0,20 5,15 10,18 15,5 20,12 25,8 30,2" },
    { title: "Scholarship Match", val: recommendations?.scholarships?.length ? "85%" : "N/A", tip: recommendations?.scholarships?.length ? `High odds for: ${recommendations.scholarships[0].name}` : "Check eligibility in scholarships tab.", progress: 85, color: "text-amber-500", points: "0,5 5,12 10,8 15,20 20,15 25,22 30,10" },
    { title: "Study Progress", val: "40%", tip: "Keep grades up to match university criteria.", progress: 40, color: "text-rose-500", points: "0,22 5,18 10,20 15,12 20,15 25,8 30,15" },
    { title: "Future Readiness", val: "91%", tip: `${topCareerName} has low automation risk.`, progress: 91, color: "text-sky-500", points: "0,12 5,8 10,15 15,5 20,22 25,10 30,5" }
  ];

  const recentActivities = [
    { action: "Profile Synced", detail: "Database synchronized successfully", time: "Just now" },
    { action: "Analyzed Skills", detail: `Readiness checklist generated for ${topCareerName}`, time: "10 mins ago" },
    { action: "Compared Careers", detail: `Interactive metrics loaded`, time: "30 mins ago" }
  ];

  const careerInsights = [
    { text: `Based on your interests in ${user.interests.slice(0, 3).join(', ')}, you have a high compatibility with ${topCareerName}.`, type: "success" },
    { text: recommendations?.skills?.missingSkills?.length ? `Learning ${recommendations.skills.missingSkills[0]} would improve your readiness score.` : "All core skills look strong.", type: "info" },
    { text: recommendations?.scholarships?.length ? `Available grants found for target country ${user.preferredCountry || 'India'}.` : "Check financial aids for college pathways.", type: "warning" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setChatOpen(true);
    sendChatMessage(`Analyze details for query: ${searchVal}`);
  };

  const careersList = recommendations?.careers || [];

  const roadmapSteps = recommendations?.roadmap || [
    { step: "Class 11 & 12 Studies", description: "Build core stream metrics.", status: "completed" },
    { step: "College Prep", description: "Register for required university entrance exams.", status: "active" },
    { step: "Undergrad Degree", description: "Acquire specialized major curriculum.", status: "upcoming" },
    { step: "Career Placement", description: "Undergo professional industry internship.", status: "upcoming" }
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
      {/* Search & Motivation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
        <div>
          <p className="text-slate-400 text-xs italic">"The best way to predict the future is to create it." — Peter Drucker</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-sm w-full">
          <Search size={15} className="text-slate-450 shrink-0" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Ask AI: What are my best career options?"
            className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
          />
          <button type="submit" className="text-[10px] text-indigo-500 font-bold hover:underline shrink-0">Ask AI</button>
        </form>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, y: -2 }}
                onClick={() => navigate(action.path)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm text-center cursor-pointer select-none hover:border-indigo-550/40 transition-colors flex flex-col items-center justify-center gap-2"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow`}>
                  <Icon size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{action.title}</h4>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {summaryCards.map((card, idx) => (
          <GlassCard key={idx} className="flex flex-col justify-between h-32 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{card.title}</span>
              <svg className="w-10 h-6 stroke-current text-indigo-500/60 dark:text-indigo-400/40" fill="none" viewBox="0 0 30 25">
                <path d={`M ${card.points}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className={`text-2xl font-bold font-heading mt-1 ${card.color}`}>{card.val}</h2>
              <p className="text-[9px] text-slate-400 leading-tight mt-1 line-clamp-2">{card.tip}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Row 2: AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended careers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top AI Recommendations</h3>
            <button onClick={() => navigate('/career-discovery')} className="text-[10px] text-indigo-500 font-bold hover:underline flex items-center gap-0.5">Explore All <ArrowRight size={10} /></button>
          </div>

          <div className="space-y-3">
            {careersList.length === 0 ? (
              <p className="text-xs text-slate-400">Loading recommendations...</p>
            ) : (
              careersList.slice(0, 4).map((career: any) => {
                const isSaved = savedCareers.includes(career.id);
                return (
                  <div key={career.id} className="glass-panel p-4 rounded-xl flex items-center justify-between hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all border border-slate-200/50 dark:border-slate-800/50">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm">{career.name}</h4>
                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
                        <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-semibold">96% Match</span>
                        <span>Avg: {career.avgSalaryIndia}</span>
                        <span>Diff: {career.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleSaveCareer(career.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400"
                      >
                        {isSaved ? <BookmarkCheck size={14} className="text-indigo-500" /> : <BookmarkCheck size={14} className="text-slate-350" />}
                      </button>
                      <button 
                        onClick={() => navigate('/career-roadmap')}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all text-slate-700 dark:text-slate-350"
                      >
                        Roadmap
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Career Insights alerts */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Career Insights</h3>
          <div className="space-y-3">
            {careerInsights.map((insight, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl border border-indigo-500/10 bg-indigo-500/5 dark:bg-indigo-500/5 text-xs text-slate-600 dark:text-slate-350 leading-relaxed flex gap-2.5 items-start"
              >
                <Sparkles size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Career Progress Milestone Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Career Milestone Timeline</h3>
          <GlassCard className="p-5 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-slate-800 dark:text-slate-200">Goal: {topCareerName}</span>
              <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">Active Track</span>
            </div>
            
            {/* Visual Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {roadmapSteps.slice(0, 4).map((step: any, idx: number) => (
                <div 
                  key={idx}
                  className={`border-l-2 md:border-l-0 md:border-t-2 pl-4 md:pl-0 md:pt-4 relative space-y-1 ${
                    step.status === 'completed' 
                      ? 'border-emerald-500' 
                      : step.status === 'active' 
                      ? 'border-indigo-500' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className={`absolute -left-1.5 md:left-0 top-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                    step.status === 'completed' 
                      ? 'bg-emerald-500' 
                      : step.status === 'active' 
                      ? 'bg-indigo-500' 
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`} />
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">{step.step}</h4>
                  <p className="text-[10px] text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Recent Activity list */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
          <GlassCard className="p-4 space-y-3.5">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2.5 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">{act.action}</h4>
                  <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{act.detail}</p>
                </div>
                <span className="text-[10px] text-slate-400">{act.time}</span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>

      {/* Row 6: Mini Report Preview */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI Career Blueprint Workbook</h3>
        <GlassCard className="p-5 flex flex-col md:flex-row items-center justify-between gap-6 border-indigo-500/10 dark:border-indigo-400/5 bg-indigo-500/[0.01]">
          <div className="space-y-2">
            <h4 className="font-bold text-sm font-heading">Ready to view your full aggregated blueprint?</h4>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Our Cost Calculator, Scholarship Agent, and Country Advisor outputs have been formatted into a professional workbook. Review college pathways, PR options, and required licenses in one place.
            </p>
          </div>
          <button 
            onClick={() => navigate('/ai-report')}
            className="btn-primary flex items-center gap-1.5 shrink-0 text-xs py-2 px-4 shadow"
          >
            Open Report Preview <ArrowUpRight size={14} />
          </button>
        </GlassCard>
      </div>
    </div>
  );
};

