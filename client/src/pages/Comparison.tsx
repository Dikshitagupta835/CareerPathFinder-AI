import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';
import { 
  GitCompare, Check, Plus, Trash2, BrainCircuit 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, CartesianGrid 
} from 'recharts';

export const Comparison: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allCareers = [
    { id: 'chartered-accountant', name: "Chartered Accountant", salary: 850000, duration: "5 Years", fees: "₹2.5L", difficulty: "Hard", aiRisk: "22%", stress: "High", growth: 12 },
    { id: 'financial-analyst', name: "Financial Analyst", salary: 750000, duration: "3-4 Years", fees: "₹6.0L", difficulty: "Medium", aiRisk: "45%", stress: "Medium", growth: 15 },
    { id: 'investment-banker', name: "Investment Banker", salary: 1500000, duration: "5 Years", fees: "₹18.0L", difficulty: "Hard", aiRisk: "12%", stress: "Very High", growth: 18 },
    { id: 'management-consultant', name: "Management Consultant", salary: 1200000, duration: "4 Years", fees: "₹12.0L", difficulty: "Hard", aiRisk: "15%", stress: "High", growth: 14 },
    { id: 'data-scientist', name: "Data Scientist", salary: 1100000, duration: "3-4 Years", fees: "₹8.0L", difficulty: "Medium", aiRisk: "18%", stress: "Medium", growth: 25 },
    { id: 'business-analyst', name: "Business Analyst", salary: 700000, duration: "3 Years", fees: "₹5.0L", difficulty: "Easy", aiRisk: "38%", stress: "Low", growth: 14 }
  ];

  const activeCareers = allCareers.filter(c => selectedIds.includes(c.id));

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length < 5) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  // Recharts formatted salary comparison data
  const salaryChartData = activeCareers.map(c => ({
    name: c.name.split(' ').map(w => w.charAt(0)).join(''), // Abbreviation
    fullName: c.name,
    Salary: c.salary / 100000 // In Lakhs
  }));

  const growthChartData = activeCareers.map(c => ({
    name: c.name.split(' ').map(w => w.charAt(0)).join(''),
    fullName: c.name,
    "Growth Rate %": c.growth
  }));

  if (selectedIds.length === 0) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <GitCompare size={22} className="text-brand-primary" /> Career Comparison Matrix
          </h2>
          <p className="text-xs text-slate-400">Compare up to 5 careers across salary metrics, tuition, stress indexes, and automation risks.</p>
        </div>

        {/* Select buttons */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl flex flex-wrap gap-2 transition-colors">
          <span className="text-xs font-bold text-slate-450 self-center mr-2">Select Careers:</span>
          {allCareers.map((c) => {
            const selected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => handleToggle(c.id)}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  selected 
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-550 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {selected ? <Check size={12} /> : <Plus size={12} />}
                {c.name}
              </button>
            );
          })}
        </div>

        <EmptyState
          illustration={
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 5l7 2M12 5L5 7M5 7l2 8M19 7l-2 8M8 15h8M9 20h6" />
            </svg>
          }
          heading="No careers added yet ⚖"
          subtext="Search and add up to 5 careers to compare them side by side."
          buttonText="+ Add a Career to Compare"
          onButtonClick={() => {
            setSelectedIds(['chartered-accountant', 'financial-analyst', 'management-consultant']);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <GitCompare size={22} className="text-brand-primary" /> Career Comparison Matrix
          </h2>
          <p className="text-xs text-slate-400">Compare up to 5 careers across salary metrics, tuition, stress indexes, and automation risks.</p>
        </div>
      </div>

      {/* Select buttons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl flex flex-wrap gap-2 transition-colors">
        <span className="text-xs font-bold text-slate-450 self-center mr-2">Select Careers:</span>
        {allCareers.map((c) => {
          const selected = selectedIds.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => handleToggle(c.id)}
              className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                selected 
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-550 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {selected ? <Check size={12} /> : <Plus size={12} />}
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-slate-450 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 w-48 shrink-0">Metric</th>
                {activeCareers.map(c => (
                  <th key={c.id} className="p-4 font-bold text-slate-800 dark:text-slate-100 font-heading">
                    <div className="flex justify-between items-center">
                      <span>{c.name}</span>
                      <button 
                        onClick={() => handleToggle(c.id)}
                        className="text-slate-400 hover:text-rose-500 font-normal ml-2"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <tr>
                <td className="p-4 font-bold bg-slate-50/50 dark:bg-slate-950/20 text-slate-450">Avg Entry Salary</td>
                {activeCareers.map(c => (
                  <td key={c.id} className="p-4 font-bold text-indigo-550">₹{(c.salary / 100000).toFixed(1)} LPA</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-50/50 dark:bg-slate-950/20 text-slate-450">Est Duration</td>
                {activeCareers.map(c => (
                  <td key={c.id} className="p-4">{c.duration}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-50/50 dark:bg-slate-950/20 text-slate-450">Approx Fees</td>
                {activeCareers.map(c => (
                  <td key={c.id} className="p-4">{c.fees}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-50/50 dark:bg-slate-950/20 text-slate-450">Entry Exam Difficulty</td>
                {activeCareers.map(c => (
                  <td key={c.id} className="p-4 font-bold text-amber-500">{c.difficulty}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-50/50 dark:bg-slate-950/20 text-slate-450">AI Automation Risk</td>
                {activeCareers.map(c => (
                  <td key={c.id} className="p-4 font-bold text-rose-500">{c.aiRisk}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-50/50 dark:bg-slate-950/20 text-slate-450">Annual Growth Rate</td>
                {activeCareers.map(c => (
                  <td key={c.id} className="p-4 font-bold text-emerald-500">{c.growth}%</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-50/50 dark:bg-slate-950/20 text-slate-450">Stress Index</td>
                {activeCareers.map(c => (
                  <td key={c.id} className="p-4">{c.stress}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Recharts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Salary */}
        <GlassCard className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary comparison (₹ LPA starting)</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} LPA`, 'Starting Salary']} />
                <Legend />
                <Bar dataKey="Salary" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 text-center italic">*Abbreviations: CA = Chartered Accountant, FA = Financial Analyst, MC = Management Consultant</p>
        </GlassCard>

        {/* Chart 2: Growth */}
        <GlassCard className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Growth Rate %</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
                <Legend />
                <Line type="monotone" dataKey="Growth Rate %" stroke="#7C3AED" strokeWidth={2.5} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* AI Recommendation Panel */}
      <GlassCard className="p-5 space-y-3 border-indigo-500/10 dark:border-indigo-400/5 bg-indigo-500/[0.01]">
        <div className="flex items-center gap-2">
          <BrainCircuit size={18} className="text-indigo-500" />
          <h4 className="font-bold text-sm font-heading">AI Comparison Intelligence Analysis</h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
          Based on your profile, **Chartered Accountant** offers the most secure pathway with high global recognition and low disruption from AI models, but carries a high examination stress level. **Financial Analyst** offers a smoother academic process (often coupled with CFA charter) and yields higher starting scales inside urban hubs (like Bangalore or Mumbai) with 15% growth. **Management Consulting** provides high initial compensation structures (₹12 LPA starting) but has a strict selection filter focusing heavily on Tier-1 MBAs.
        </p>
      </GlassCard>
    </div>
  );
};
