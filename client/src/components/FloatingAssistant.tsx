import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Sparkles, GraduationCap, Globe, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FloatingAssistant: React.FC = () => {
  const { 
    chatOpen, setChatOpen, chatHistory, sendChatMessage, isThinking, thinkingAgent, user 
  } = useApp();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    const txt = input;
    setInput('');
    await sendChatMessage(txt);
  };

  const handleSuggestClick = async (prompt: string) => {
    if (isThinking) return;
    await sendChatMessage(prompt);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-medium px-5 py-3 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform select-none"
      >
        <motion.div
          animate={isThinking ? { rotate: 360 } : {}}
          transition={isThinking ? { repeat: Infinity, duration: 2, ease: "linear" } : {}}
        >
          <Sparkles size={18} />
        </motion.div>
        <span>Ask AI Coach</span>
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-colors duration-200"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">
                    AI Career Coach
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">
                    Multi-Agent Orchestrator
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Context bar */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 flex flex-wrap gap-2 items-center">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">Context:</span>
              <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-[120px]">{user.name}</span>
              <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">{user.educationLevel}</span>
              <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">{user.preferredCountry}</span>
              <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">Budget: ₹{(user.budget / 100000).toFixed(1)}L</span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Label */}
                  {msg.sender === 'ai' && (
                    <span className="text-[9px] font-bold text-slate-400 mb-1 tracking-wider uppercase ml-1 flex items-center gap-1">
                      🤖 {msg.agent || 'Specialized Agent'}
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div 
                    className={`max-w-[90%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-tr-none shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50 shadow-sm'
                    }`}
                  >
                    {/* Render simple markdown bold markers */}
                    <div className="whitespace-pre-line">
                      {msg.text.split('**').map((chunk, idx) => 
                        idx % 2 === 1 ? <strong key={idx} className="font-semibold text-brand-primary dark:text-indigo-300">{chunk}</strong> : chunk
                      )}
                    </div>

                    {/* DYNAMIC WIDGETS RENDERING */}
                    {msg.widgets && (
                      <div className="mt-3 space-y-3 pt-2 border-t border-slate-200/40 dark:border-slate-700/40">
                        {/* 1. Recommended Career Cards */}
                        {msg.widgets.careers && msg.widgets.careers.map((c) => (
                          <div key={c.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">{c.name}</h4>
                              <p className="text-[10px] text-slate-400">Starting Salary: {c.avgSalaryIndia}</p>
                            </div>
                            <button 
                              onClick={() => { setChatOpen(false); navigate('/career-roadmap'); }}
                              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                            >
                              View Roadmap →
                            </button>
                          </div>
                        ))}

                        {/* 2. Colleges Cards */}
                        {msg.widgets.colleges && msg.widgets.colleges.map((col) => (
                          <div key={col.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <div className="flex items-start gap-2">
                              <GraduationCap size={16} className="text-purple-500 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">{col.name}</h4>
                                <p className="text-[10px] text-slate-500">{col.city}, {col.country} • Tuition: {col.fees}</p>
                              </div>
                            </div>
                            <div className="mt-2 flex justify-between items-center text-[10px] border-t border-slate-100 dark:border-slate-800 pt-1.5">
                              <span className="text-slate-400">Avg Package: {col.avgPackage}</span>
                              <button 
                                onClick={() => { setChatOpen(false); navigate('/colleges'); }}
                                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                              >
                                Detail View
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* 3. Scholarship Cards */}
                        {msg.widgets.scholarships && msg.widgets.scholarships.map((s) => (
                          <div key={s.id} className="p-3 bg-indigo-50/50 dark:bg-slate-900 border border-indigo-200/50 dark:border-slate-800 rounded-xl shadow-sm">
                            <div className="flex items-start gap-2">
                              <Award size={16} className="text-emerald-500 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">{s.name}</h4>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{s.amount}</p>
                              </div>
                            </div>
                            <div className="mt-2 text-[10px] text-slate-400 flex justify-between border-t border-indigo-100/50 dark:border-slate-800/50 pt-1.5">
                              <span>Deadline: {s.deadline}</span>
                              <button 
                                onClick={() => { setChatOpen(false); navigate('/scholarships'); }}
                                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                              >
                                Verify Eligibility
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* 4. Salary Widget */}
                        {msg.widgets.salary && (
                          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp size={16} className="text-indigo-500" />
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">{msg.widgets.salary.careerName} Salaries</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded">
                                <p className="text-slate-400">Avg Starting</p>
                                <p className="font-bold text-slate-700 dark:text-slate-200">{msg.widgets.salary.avgSalaryIndia}</p>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded">
                                <p className="text-slate-400">Growth Forecast</p>
                                <p className="font-bold text-emerald-500">{msg.widgets.salary.growthRate} YoY</p>
                              </div>
                            </div>
                            <p className="text-[9px] text-slate-400 italic">AI Automation Risk: {Math.round(msg.widgets.salary.automationRisk * 100)}% (Low)</p>
                          </div>
                        )}

                        {/* 5. Country Widget */}
                        {msg.widgets.country && (
                          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Globe size={16} className="text-amber-500" />
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">{msg.widgets.country.name} Pathway</h4>
                                <p className="text-[10px] text-slate-400">PR Chance: {msg.widgets.country.prPossibility} • Cost: {msg.widgets.country.livingCost}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => { setChatOpen(false); navigate('/countries'); }}
                              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                            >
                              Explore
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[9px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* AI Thinking Placeholder */}
              {isThinking && (
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-bold text-indigo-500 mb-1 tracking-wider uppercase ml-1 flex items-center gap-1 animate-pulse">
                    ✨ Thinking: {thinkingAgent}...
                  </span>
                  <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-2 scrollbar-none whitespace-nowrap bg-slate-50/50 dark:bg-slate-950/20 select-none">
              <button 
                onClick={() => handleSuggestClick("Which commerce careers offer the highest starting salaries?")}
                className="text-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-colors"
              >
                📈 Salary
              </button>
              <button 
                onClick={() => handleSuggestClick("Can you suggest colleges in Canada within a ₹15 Lakhs budget?")}
                className="text-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-colors"
              >
                🎓 Canada Colleges
              </button>
              <button 
                onClick={() => handleSuggestClick("What are the criteria for the Lester B. Pearson Scholarship?")}
                className="text-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-colors"
              >
                💰 Scholarships
              </button>
              <button 
                onClick={() => handleSuggestClick("Compare Chartered Accountant vs Financial Analyst details.")}
                className="text-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-colors"
              >
                ⚖ Compare Careers
              </button>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-950">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isThinking}
                placeholder="Ask anything about your future..."
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500/40 dark:focus:border-indigo-400/40"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isThinking}
                className="p-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
