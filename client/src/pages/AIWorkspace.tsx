import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Send, Pin, BookOpen, Star, GraduationCap, DollarSign, BarChart2
} from 'lucide-react';

export const AIWorkspace: React.FC = () => {
  const { 
    chatHistory, sendChatMessage, isThinking, thinkingAgent, user 
  } = useApp();
  const [input, setInput] = useState('');
  const [activeMessageId, setActiveMessageId] = useState<string>('welcome');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    { text: "Compare CA vs CFA", prompt: "Compare Chartered Accountant vs CFA." },
    { text: "Scholarships in Canada", prompt: "Suggest scholarships in Canada for my profile." },
    { text: "ROI of MBA", prompt: "Explain the ROI and cost breakdown of doing BCom/MBA." },
    { text: "AI Automation Risks", prompt: "Explain AI automation risks in Finance." },
    { text: "Germany Visa PR", prompt: "What is the visa difficulty and PR pathway in Germany?" }
  ];

  const previousChats = [
    { id: "welcome", title: "Coach Introduction", date: "Today" },
    { id: "ca-path", title: "Chartered Accountant Roadmap", date: "Yesterday" },
    { id: "toronto-fees", title: "Toronto Uni tuition check", date: "3 days ago" },
    { id: "sch-merit", title: "Merit scholarships Canada", date: "1 week ago" }
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    const currentTxt = input;
    setInput('');
    await sendChatMessage(currentTxt);

    // Make the latest message active
    setTimeout(() => {
      if (chatHistory.length > 0) {
        setActiveMessageId(chatHistory[chatHistory.length - 1].id);
      }
    }, 100);
  };

  const handleChipClick = async (prompt: string) => {
    if (isThinking) return;
    await sendChatMessage(prompt);
  };

  // Find the active message to render widgets on the right side
  const activeMessage = chatHistory.find(m => m.id === activeMessageId) || chatHistory[chatHistory.length - 1];

  return (
    <div className="flex-1 flex overflow-hidden h-full select-none transition-colors duration-200">
      
      {/* 1. Left Sidebar: History */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0 transition-colors">
        <div className="flex items-center gap-2 mb-4 px-2">
          <BookOpen size={16} className="text-slate-400" />
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coach History</h4>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {previousChats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveMessageId(c.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeMessageId === c.id 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold' 
                  : 'text-slate-500 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="truncate flex items-center gap-1.5">
                <Pin size={11} className={activeMessageId === c.id ? 'text-indigo-500' : 'text-slate-400'} />
                {c.title}
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5 ml-4">{c.date}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. Middle Panel: Chat Feed */}
      <section className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-950/20 border-r border-slate-200 dark:border-slate-900 overflow-hidden relative">
        {/* Messages Feed scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {chatHistory.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => setActiveMessageId(msg.id)}
              className={`flex flex-col gap-1.5 cursor-pointer p-3 rounded-2xl transition-all ${
                activeMessageId === msg.id 
                  ? 'bg-indigo-500/[0.02] dark:bg-indigo-500/[0.01] border border-indigo-500/10' 
                  : 'border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {msg.sender === 'user' ? `👤 ${user?.name || 'User'}` : `🤖 ${msg.agent || 'Specialized Agent'}`}
                </span>
                <span className="text-[9px] text-slate-450">{msg.timestamp}</span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-1.5">
                {msg.text.split('**').map((chunk, idx) => 
                  idx % 2 === 1 ? <strong key={idx} className="font-semibold text-brand-primary dark:text-indigo-300">{chunk}</strong> : chunk
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-[9px] font-bold text-indigo-550 animate-pulse uppercase tracking-wider">
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

        {/* Suggestion Chips */}
        <div className="px-6 py-2 overflow-x-auto flex gap-2 border-t border-slate-100 dark:border-slate-900 scrollbar-none whitespace-nowrap bg-slate-50/50 dark:bg-slate-950/20">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip.prompt)}
              className="text-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-350 hover:border-indigo-500/40 hover:text-indigo-600 transition-colors"
            >
              {chip.text}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isThinking}
            placeholder="Ask anything about your future (e.g., 'ca exam requirements', 'study in Canada')..."
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="p-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl disabled:opacity-50 transition-all shadow"
          >
            <Send size={15} />
          </button>
        </form>

        {/* AI Sources Verification Footer */}
        <footer className="px-6 py-2 border-t border-slate-100 dark:border-slate-900 text-[9px] text-slate-400 flex flex-wrap justify-between items-center gap-2 bg-slate-50 dark:bg-slate-950">
          <div className="flex gap-3">
            <span>📚 Career Database: Verified</span>
            <span>💰 Scholarship Database: Verified</span>
            <span>📊 Salary Indices: Verified</span>
          </div>
          <span className="font-semibold text-indigo-500">Confidence Match Score: 96%</span>
        </footer>
      </section>

      {/* 3. Right Sidebar: Contextual Insight Panels */}
      <aside className="hidden xl:flex flex-col w-80 bg-slate-50 dark:bg-slate-900 p-5 overflow-y-auto space-y-4 shrink-0 transition-colors">
        <div className="border-b border-slate-250 dark:border-slate-800 pb-3">
          <h3 className="font-heading font-bold text-xs text-slate-850 dark:text-slate-150">Active Widget Insights</h3>
          <p className="text-[9px] text-slate-400 mt-0.5">Click any response bubble to load its widgets.</p>
        </div>

        {activeMessage?.widgets ? (
          <div className="space-y-4">
            {/* Career Widget */}
            {activeMessage.widgets.careers && (
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><Star size={14} className="text-indigo-500" /> Recommended Careers</h4>
                {activeMessage.widgets.careers.map((c) => (
                  <div key={c.id} className="p-2.5 bg-white dark:bg-slate-850 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-[10px] space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{c.name}</span>
                      <span className="text-indigo-500">96%</span>
                    </div>
                    <p className="text-slate-400">Salary: {c.avgSalaryIndia} (India) • Risk: Low</p>
                  </div>
                ))}
              </GlassCard>
            )}

            {/* College Cards */}
            {activeMessage.widgets.colleges && (
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><GraduationCap size={14} className="text-purple-500" /> University Pathways</h4>
                {activeMessage.widgets.colleges.map((col) => (
                  <div key={col.id} className="p-2.5 bg-white dark:bg-slate-850 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-[10px] space-y-1">
                    <h5 className="font-bold text-slate-850 dark:text-slate-200">{col.name}</h5>
                    <p className="text-slate-400">{col.city}, {col.country}</p>
                    <p className="text-slate-500 font-medium">Tuition: {col.fees}</p>
                  </div>
                ))}
              </GlassCard>
            )}

            {/* Scholarships list */}
            {activeMessage.widgets.scholarships && (
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><DollarSign size={14} className="text-emerald-500" /> Scholar Matcher</h4>
                {activeMessage.widgets.scholarships.map((s) => (
                  <div key={s.id} className="p-2.5 bg-white dark:bg-slate-850 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-[10px] space-y-1">
                    <h5 className="font-bold text-slate-850 dark:text-slate-200">{s.name}</h5>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">{s.amount}</p>
                  </div>
                ))}
              </GlassCard>
            )}

            {/* Salary Widget */}
            {activeMessage.widgets.salary && (
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><BarChart2 size={14} className="text-indigo-500" /> Salary Explorer Output</h4>
                <div className="p-2.5 bg-white dark:bg-slate-850 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-[10px] space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700 dark:text-slate-350">Avg Starter</span>
                    <span>{activeMessage.widgets.salary.avgSalaryIndia}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700 dark:text-slate-350">Growth Rate</span>
                    <span className="text-emerald-500">+{activeMessage.widgets.salary.growthRate}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700 dark:text-slate-350">AI Risk</span>
                    <span className="text-rose-500">28% (Low)</span>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-6 text-[10px] text-slate-400">
            No active widgets generated in this message. Submit a prompt like "Canada colleges" or "compare careers" to render.
          </div>
        )}
      </aside>
    </div>
  );
};
