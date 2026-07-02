import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, HelpCircle, Star, Map, GraduationCap, DollarSign, Globe } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    { title: "🤖 AI Career Coach", text: "Engage in natural dialogues about your education, preferences, and future pathways with a globally informed assistant.", icon: Sparkles },
    { title: "🎯 Personalized Matches", text: "Our multi-agent system reviews your skills, subjects, target budget, and visa goals to rank career prospects.", icon: Star },
    { title: "🗺 Interactive Roadmaps", text: "Receive a structured timeline charting high school steps, degrees, exams, and corporate checkpoints.", icon: Map },
    { title: "🎓 University Finder", text: "Browse and filter colleges globally based on scholarship availability, placement metrics, and tuition costs.", icon: GraduationCap },
    { title: "💰 Scholarship Matcher", text: "Verify eligibility instantly for government, private, and international grants using AI evaluations.", icon: DollarSign },
    { title: "🌍 Study Abroad Planner", text: "Evaluate country stats, visa success rates, cost of living metrics, and PR pathways to optimize savings.", icon: Globe },
  ];

  const trustStats = [
    "25,000+ Career Paths", "150+ Countries Covered", "12,000+ Universities", 
    "50,000+ Scholarships", "AI-Powered Matching", "Interactive Timelines"
  ];

  const testimonials = [
    { name: "Siddharth Verma", role: "Commerce Student", text: "CareerPathFinder AI made choosing between CA and CFA simple. The ROI calculator showed me my exact break-even timeline for both options!" },
    { name: "Priya Menon", role: "Parent & Counselor", text: "An indispensable tool for high schoolers. The multi-agent explanation for studying in Germany vs Canada helped us make an informed decision." },
    { name: "Amit Patel", role: "Software Engineer", text: "The skill gap analyzer mapped my engineering competencies and advised which cloud certificates would trigger the fastest promotion." },
    { name: "Rohan Joshi", role: "Class 11 Student", text: "I love the Google Maps feel of the Career Universe. It makes browsing alternative pathways fun instead of stressful." },
    { name: "Meera Sen", role: "HR Consultant", text: "The salary explorer trends match active market hires perfectly. Essential data for students planning abroad." }
  ];

  const faqs = [
    { q: "How accurate is the AI recommendation?", a: "Highly accurate. Recommendations are computed by an Orchestrator Agent querying live regional databases for colleges, exams, and salaries. The agent applies structural rules rather than making simple guesses." },
    { q: "Can I compare multiple careers side-by-side?", a: "Yes! You can add up to 5 careers to compare average salaries, study duration, entry difficulty, AI automation risk index, stress ratings, and PR pathways." },
    { q: "Does the system support international study options?", a: "Absolutely. The system features detailed immigration profiles for India, Canada, Germany, UK, USA, Singapore, and Australia, including post-study work visa timelines." },
    { q: "How does the scholarship matcher evaluate eligibility?", a: "By checking your academic marks, family income cap, and preferred country rules against global scholarship databases, calculating a probability rating and steps to improve it." },
    { q: "Are the roadmaps static or dynamic?", a: "Roadmaps update dynamically as your profile changes. You can check off completed steps, add custom milestones, and review recommended online courses." }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-body overflow-y-auto select-none transition-colors duration-200">
      {/* Header navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-lg shadow">
            C
          </div>
          <span className="font-bold text-lg font-heading tracking-tight">CareerPathFinder AI</span>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4"
        >
          Access Command Center <ArrowRight size={14} />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
        {/* Soft Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[100px] pointer-events-none -z-10" />

        <span className="bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 font-semibold px-4 py-1.5 rounded-full text-xs tracking-wide mb-6 uppercase flex items-center gap-1.5 shadow-sm border border-indigo-500/20">
          <Sparkles size={12} /> Discover Your Future. Powered by AI.
        </span>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl font-heading mb-6 tracking-tight">
          Discover Your Perfect Career with{' '}
          <span className="bg-gradient-to-r from-brand-primary via-indigo-500 to-brand-secondary bg-clip-text text-transparent">
            Multi-Agent AI
          </span>
        </h1>

        <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed font-normal">
          CareerPathFinder AI acts like Google Maps for your life. It analyzes your interests, budget, country targets, and skills to chart personalized academic roadmaps.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button 
            onClick={() => navigate('/career-discovery')}
            className="btn-primary px-8 py-3 text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            Start Exploring <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-secondary px-8 py-3 text-sm flex items-center justify-center gap-2"
          >
            Watch Demo Dashboard
          </button>
        </div>
      </section>

      {/* Trust Stats Strip */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto flex items-center justify-between gap-6 whitespace-nowrap scrollbar-none text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
          {trustStats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              <span>{stat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">Intelligent Suite of Career Utilities</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Each workspace is driven by an AI agent communicating with dedicated backend tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-glass hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-base mb-2 font-heading">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-20 border-y border-slate-200 dark:border-slate-850 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">How CareerPathFinder Works</h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Three simple steps to generate your multi-agent personalized report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg mb-4 shadow">
                1
              </div>
              <h3 className="font-bold text-sm mb-2 font-heading">Onboard profile details</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tell us about your target budget, subjects you enjoy, degree goals, and preferred countries.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-brand-secondary text-white flex items-center justify-center font-bold text-lg mb-4 shadow">
                2
              </div>
              <h3 className="font-bold text-sm mb-2 font-heading">AI Agents collaborate</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Orchestrator delegates queries to specialized sub-agents checking tuition, PR paths, and skills.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-lg mb-4 shadow">
                3
              </div>
              <h3 className="font-bold text-sm mb-2 font-heading">Access interactive map</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Unlock charts, compare careers, estimate study ROI, and export a consolidated PDF workbook.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">Empowering Students Worldwide</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Real feedback from graduates, parents, and professional mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-glass border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-4 leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{t.name}</h4>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-xs md:text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                <span>{faq.q}</span>
                <HelpCircle size={16} className="text-slate-400" />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-950 transition-colors mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-primary flex items-center justify-center text-white font-bold text-sm">C</div>
            <span className="font-bold text-slate-800 dark:text-slate-200">CareerPathFinder AI</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-indigo-500 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-indigo-500 cursor-pointer">Terms of Service</span>
            <span className="hover:text-indigo-500 cursor-pointer">Contact Us</span>
          </div>
          <p>© 2026 CareerPathFinder AI. Built for Kaggle capstone.</p>
        </div>
      </footer>
    </div>
  );
};
