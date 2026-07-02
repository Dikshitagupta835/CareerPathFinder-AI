import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Home, Compass, GitCompare, Map, GraduationCap, DollarSign, 
  Globe, BarChart2, FileText, Settings, Moon, Sun, LogOut, Compass as UniverseIcon 
} from 'lucide-react';

interface SidebarProps {
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { user, darkMode, setDarkMode } = useApp();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Career Discovery', path: '/career-discovery', icon: Compass },
    { name: 'Career Comparison', path: '/career-comparison', icon: GitCompare },
    { name: 'Career Roadmap', path: '/career-roadmap', icon: Map },
    { name: 'Career Universe', path: '/career-universe', icon: UniverseIcon },
    { name: 'Colleges', path: '/colleges', icon: GraduationCap },
    { name: 'Scholarships', path: '/scholarships', icon: DollarSign },
    { name: 'Countries', path: '/countries', icon: Globe },
    { name: 'Salary Explorer', path: '/salary-explorer', icon: BarChart2 },
    { name: 'AI Career Report', path: '/ai-report', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full select-none shrink-0 transition-colors duration-200">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-lg shadow-md">
            C
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 font-heading">
              CareerPathFinder
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
              AI Career OS
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm relative overflow-hidden active-glow' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-r-md" />
                )}
                <Icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile and Settings */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* User profile brief */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{user.degree} • {user.educationLevel}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Logout link simulation */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation Bar (Bottom Tab Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-850 backdrop-blur z-50 flex items-center justify-around px-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-[8px] font-medium tracking-tight mt-0.5 truncate max-w-full">
                {item.name.split(' ')[0]}
              </span>
            </Link>
          );
        })}
        {/* Settings button on Mobile */}
        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
            location.pathname === '/settings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <Settings size={20} />
          <span className="text-[8px] font-medium tracking-tight mt-0.5">Settings</span>
        </Link>
      </div>
    </>
  );
};
