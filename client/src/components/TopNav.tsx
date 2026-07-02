import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopNav: React.FC = () => {
  const { user, isThinking, thinkingAgent, setChatOpen } = useApp();
  const [greeting, setGreeting] = useState("Good Morning");
  const navigate = useNavigate();

  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good Morning");
    else if (hr < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur select-none flex items-center justify-between px-6 shrink-0 z-30 transition-colors duration-200">
      {/* Search Bar / Greeting */}
      <div className="flex items-center gap-6">
        <h2 className="text-sm md:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 font-heading">
          {greeting}, <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">{user.name.split(' ')[0]}</span> 👋
        </h2>
        
        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 max-w-xs text-xs font-medium border border-transparent focus-within:border-indigo-500/30 transition-all duration-200">
          <Search size={14} />
          <input 
            type="text" 
            placeholder="Search careers, colleges, scholarships..." 
            className="bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 w-48 text-[11px]"
          />
        </div>
      </div>

      {/* Action Items / Agent Status */}
      <div className="flex items-center gap-4">
        {/* AI Agent Status Indicator */}
        <div 
          onClick={() => setChatOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold select-none cursor-pointer transition-all duration-200 ${
            isThinking 
              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 agent-glowing' 
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
          }`}
        >
          <Sparkles size={13} className={isThinking ? 'animate-spin' : ''} />
          <span>
            {isThinking ? `Thinking: ${thinkingAgent}` : 'Coach Status: Online'}
          </span>
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 relative transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-danger" />
        </button>

        {/* Profile Avatar */}
        <div 
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white flex items-center justify-center font-bold text-sm shadow select-none cursor-pointer active:scale-95 transition-transform"
        >
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};
