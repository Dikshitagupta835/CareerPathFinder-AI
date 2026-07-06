import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';
import { 
  Globe, Sparkles, Check, 
  MapPin, ArrowRight, ShieldCheck 
} from 'lucide-react';

interface CountryData {
  id: string;
  name: string;
  avgSalary: string;
  livingCost: string;
  taxes: string;
  qualityOfLife: string;
  visaDifficulty: string;
  workPermit: string;
  prPossibility: string;
  currency: string;
  safetyIndex: string;
  healthcare: string;
  language: string;
  averageRent: string;
  popularCareers: string[];
  description: string;
}

export const CountryExplorer: React.FC = () => {
  const { onboardingComplete } = useApp();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>('canada');

  const countries: CountryData[] = [
    {
      id: "india",
      name: "India",
      avgSalary: "₹7,50,000 / year",
      livingCost: "₹20,000 / month",
      taxes: "5% - 30% (Slab)",
      qualityOfLife: "Medium",
      visaDifficulty: "Easy (Native)",
      workPermit: "Unlimited",
      prPossibility: "Immediate",
      currency: "INR (₹)",
      safetyIndex: "62 / 100",
      healthcare: "Affordable private",
      language: "Hindi, English",
      averageRent: "₹15,000 / month",
      popularCareers: ["Chartered Accountant", "Software Engineer"],
      description: "India offers explosive GDP growth and startup scaling avenues. Extremely low domestic cost structures guarantee high relative savings for finance professionals."
    },
    {
      id: "canada",
      name: "Canada",
      avgSalary: "$72,000 / year",
      livingCost: "$2,200 / month",
      taxes: "15% - 33%",
      qualityOfLife: "Very High",
      visaDifficulty: "Medium",
      workPermit: "Up to 3 years PGWP",
      prPossibility: "High (Express Entry)",
      currency: "CAD ($)",
      safetyIndex: "88 / 100",
      healthcare: "Universal Free",
      language: "English, French",
      averageRent: "$1,600 / month",
      popularCareers: ["Financial Analyst", "Data Scientist"],
      description: "Canada represents your top matching country. Transparent post-study work visa structures coupled with clear Permanent Residency (PR) PR pathways make it ideal for global students."
    },
    {
      id: "germany",
      name: "Germany",
      avgSalary: "€55,000 / year",
      livingCost: "€1,200 / month",
      taxes: "30% - 42%",
      qualityOfLife: "Very High",
      visaDifficulty: "Medium",
      workPermit: "18-month seeking visa",
      prPossibility: "High (Blue Card)",
      currency: "EUR (€)",
      safetyIndex: "85 / 100",
      healthcare: "Statutory Insurance",
      language: "German, English",
      averageRent: "€800 / month",
      popularCareers: ["Automotive Engineer", "Finance Manager"],
      description: "Germany is a powerhouse with zero public university tuition. Highly protected labor metrics and excellent social benefits, but requires intermediate German fluency."
    },
    {
      id: "australia",
      name: "Australia",
      avgSalary: "A$82,000 / year",
      livingCost: "A$2,400 / month",
      taxes: "19% - 45%",
      qualityOfLife: "Very High",
      visaDifficulty: "Medium-Hard",
      workPermit: "2-4 years Graduate visa",
      prPossibility: "Medium (Points system)",
      currency: "AUD (A$)",
      safetyIndex: "89 / 100",
      healthcare: "Medicare system",
      language: "English",
      averageRent: "A$1,800 / month",
      popularCareers: ["Accountant", "Business Analyst"],
      description: "Australia offers high wages, excellent sun indices, and a solid economy. However, getting PR has become increasingly competitive under recent point reforms."
    }
  ];

  const activeCountry = countries.find(c => c.id === selectedId) || countries[1];

  const aiMatchList = [
    { name: "Canada", match: "96%", reason: "Provides best ROI for Finance budget limit of ₹12 Lakhs; Express Entry favors Commerce graduates." },
    { name: "Germany", match: "91%", reason: "Excellent savings capability due to low rents and free public tuition, but language is a barrier." },
    { name: "India", match: "87%", reason: "Highest domestic CA compliance demand; rapid startup trajectory but lower starting packages." },
    { name: "Australia", match: "82%", reason: "High living indices, but stricter migration criteria and higher tuition fees." }
  ];

  if (!onboardingComplete) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <Globe size={22} className="text-brand-primary" /> Study Abroad Country Advisor
          </h2>
          <p className="text-xs text-slate-400">Evaluate visa processing durations, Permanent Residency (PR) criteria, tax slabs, and quality of life scores.</p>
        </div>

        <EmptyState
          illustration={
            <svg className="w-10 h-10 text-indigo-505" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              <path d="M2 12h20" />
            </svg>
          }
          heading="No country matched yet 🌍"
          subtext="Tell us your interests and budget so AI can rank countries for you."
          buttonText="Find My Country Match"
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
          <Globe size={22} className="text-brand-primary" /> Study Abroad Country Advisor
        </h2>
        <p className="text-xs text-slate-400">Evaluate visa processing durations, Permanent Residency (PR) criteria, tax slabs, and quality of life scores.</p>
      </div>

      {/* Row 1: Interactive World Map pins & Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* World Map Mock panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-col justify-between h-72 relative overflow-hidden transition-colors">
          <div className="absolute top-4 left-4 z-10">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select target Country</h4>
          </div>
          
          {/* Mock Interactive map UI */}
          <div className="flex-1 flex items-center justify-center relative bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-850">
            <Globe className="text-slate-200 dark:text-slate-800/40 w-44 h-44 animate-pulse" strokeWidth={1} />
            
            {/* Country Pins */}
            {countries.map((c) => {
              const offsets = {
                india: { top: '55%', left: '52%' },
                canada: { top: '30%', left: '22%' },
                germany: { top: '35%', left: '46%' },
                australia: { top: '75%', left: '80%' }
              };
              const active = c.id === selectedId;
              const pos = (offsets as any)[c.id] || { top: '50%', left: '50%' };
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute p-2 rounded-full shadow-lg flex items-center gap-1.5 transition-all ${
                    active 
                      ? 'bg-indigo-500 text-white scale-110 z-20' 
                      : 'bg-white dark:bg-slate-850 hover:bg-indigo-50 text-slate-700 dark:text-slate-350 text-[10px] border border-slate-200 dark:border-slate-750'
                  }`}
                >
                  <MapPin size={11} />
                  <span className="font-bold text-[9px]">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Country Match Analysis */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Sparkles size={14} className="text-brand-primary" /> AI Match Rankings</h4>
          <div className="space-y-3.5 my-2">
            {aiMatchList.map((c) => (
              <div key={c.name} className="text-[11px] border-b border-slate-100 dark:border-slate-800 pb-2.5 last:border-0 last:pb-0">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{c.name} Match</span>
                  <span className="text-indigo-500">{c.match}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{c.reason}</p>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Row 2: Selected Country Dashboard details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Country core dashboard card */}
        <div className="lg:col-span-2">
          <GlassCard className="p-5 flex flex-col gap-4 border-l-4 border-l-brand-primary h-full justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Country details</span>
                <h3 className="text-base font-bold font-heading mt-0.5">{activeCountry.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mt-2">{activeCountry.description}</p>
              </div>

              {/* Grid of parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] font-medium pt-2">
                <div>
                  <span className="text-slate-400 block">Avg Starter Pay:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-250">{activeCountry.avgSalary}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Taxes slab:</span>
                  <span className="font-bold text-rose-500">{activeCountry.taxes}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Quality of Life:</span>
                  <span className="font-bold text-emerald-500">{activeCountry.qualityOfLife}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Visa difficulty:</span>
                  <span className="font-bold text-indigo-550">{activeCountry.visaDifficulty}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Work permit:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-250">{activeCountry.workPermit}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">PR Probability:</span>
                  <span className="font-bold text-emerald-500">{activeCountry.prPossibility}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Safety index:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-250">{activeCountry.safetyIndex}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Average Rent:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-250">{activeCountry.averageRent}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400">Native currency: {activeCountry.currency} ({activeCountry.language})</span>
              <button 
                onClick={() => navigate('/colleges')}
                className="text-indigo-550 font-bold hover:underline flex items-center gap-0.5"
              >
                Browse Colleges in {activeCountry.name} <ArrowRight size={12} />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Compare quick overview */}
        <GlassCard className="p-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Migration Visa Checklist</h4>
          <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <li className="flex items-start gap-2">
              <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />
              <span>**Language certificate**: IELTS aggregate score &gt; 7.0 for Canada/UK studies.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />
              <span>**Financial proof**: Mock GIC deposit account verification of $20,635 CAD.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />
              <span>**Biometrics & Health checks**: Pre-appointment scheduling.</span>
            </li>
          </ul>
        </GlassCard>

      </div>
    </div>
  );
};
