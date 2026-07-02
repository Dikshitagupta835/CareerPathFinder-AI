import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';
import { 
  BarChart2, Globe, Calculator 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  Legend, ResponsiveContainer, CartesianGrid 
} from 'recharts';

export const SalaryExplorer: React.FC = () => {
  const { user, onboardingComplete, recommendations } = useApp();
  const navigate = useNavigate();

  // ROI Calculator state
  const [fees, setFees] = useState(user.budget || 1200000);
  const [living, setLiving] = useState(25000); // per month
  const [duration, setDuration] = useState(3);
  const [scholarship, setScholarship] = useState(200000);
  const [salary, setSalary] = useState(750000); // annual expected starting

  const [roiResult, setRoiResult] = useState({
    investment: 1300000,
    breakEven: 3.5,
    roiPercent: 420,
    netValue: 7200000
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const totalTuition = fees * duration;
    const totalLiving = living * 12 * duration;
    const totalInvestment = Math.max(0, (totalTuition + totalLiving) - scholarship);
    
    const monthlySalary = salary / 12;
    const netMonthlyInHand = monthlySalary * 0.85; // 15% estimated taxes
    const monthlySavings = netMonthlyInHand * 0.40; // 40% savings rate

    let breakEvenYears = 0;
    if (monthlySavings > 0) {
      breakEvenYears = parseFloat((totalInvestment / (monthlySavings * 12)).toFixed(1));
    }

    const tenYearEarnings = salary * 10 * 1.1; // 10% raise average
    const netVal = tenYearEarnings - totalInvestment;
    const roi = totalInvestment > 0 ? Math.round((netVal / totalInvestment) * 100) : 1000;

    setRoiResult({
      investment: totalInvestment,
      breakEven: breakEvenYears,
      roiPercent: roi,
      netValue: Math.round(netVal)
    });
  };

  // Recharts salary growth trends
  const salaryTrends = [
    { name: 'Entry (0-2 yrs)', Salary: 7.0, Global: 60 },
    { name: 'Mid (3-6 yrs)', Salary: 11.0, Global: 90 },
    { name: 'Senior (7-12 yrs)', Salary: 18.0, Global: 130 },
    { name: 'Lead (12+ yrs)', Salary: 35.0, Global: 210 }
  ];

  const countryComparison = [
    { name: 'India', salary: '₹8.5 LPA', tax: '15%', living: '₹20K', savings: '45%' },
    { name: 'Canada', salary: 'C$72,000', tax: '22%', living: 'C$2.2K', savings: '20%' },
    { name: 'Germany', salary: '€55,000', tax: '38%', living: '€1.2K', savings: '25%' },
    { name: 'Australia', salary: 'A$82,000', tax: '25%', living: 'A$2.4K', savings: '18%' },
    { name: 'United Kingdom', salary: '£45,000', tax: '20%', living: '£1.4K', savings: '15%' }
  ];

  const topCareerName = recommendations?.careers?.[0]?.name || "Chartered Accountant";

  if (!onboardingComplete) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <BarChart2 size={22} className="text-brand-primary" /> Salary Explorer & ROI Calculator
          </h2>
          <p className="text-xs text-slate-400">Examine starting averages, taxation slabs, long-term saving ratios, and academic ROI calculations.</p>
        </div>

        <EmptyState
          illustration={
            <svg className="w-10 h-10 text-indigo-550" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          heading="Choose a career to explore salary ROI 💸"
          subtext="Select a pathway to unlock entry vs senior projections and ROI calculation matrices."
          buttonText="Explore Salary Trends"
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
          <BarChart2 size={22} className="text-brand-primary" /> Salary Explorer & ROI Calculator
        </h2>
        <p className="text-xs text-slate-400">Examine starting averages, taxation slabs, long-term saving ratios, and academic ROI calculations.</p>
      </div>

      {/* Row 1: Salary line chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts chart */}
        <GlassCard className="lg:col-span-2 p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Growth Trajectory (₹ LPA vs $ USD Thousand)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salaryTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Salary" name="India Salary (LPA)" stroke="#4F46E5" strokeWidth={2} />
                <Line type="monotone" dataKey="Global" name="Global Salary ($k)" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Future Demand Meter */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{topCareerName} Future Market Demand</h4>
          <div className="space-y-4 my-2 text-xs">
            <div>
              <div className="flex justify-between font-bold">
                <span>Industry Expansion Rate</span>
                <span className="text-emerald-500">12% YoY</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full w-[85%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold">
                <span>AI Disruption Risk</span>
                <span className="text-rose-500">22% (Low)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-rose-500 h-full w-[22%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold">
                <span>Global Hiring Opportunities</span>
                <span className="text-indigo-500">Very High</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-indigo-500 h-full w-[90%]" />
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">Taxation audit checks, legal governance filings, and risk compliance roles require high degree human judgment, keeping AI risk score low.</p>
        </GlassCard>

      </div>

      {/* Row 2: Country Comparison & ROI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Country matrix */}
        <GlassCard className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Globe size={14} /> Global Salary Comparison Matrix</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3">Country</th>
                  <th className="p-3">Avg Salary</th>
                  <th className="p-3">Avg Taxes</th>
                  <th className="p-3">Living Cost</th>
                  <th className="p-3">Saving Potential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                {countryComparison.map((c, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-bold">{c.name}</td>
                    <td className="p-3">{c.salary}</td>
                    <td className="p-3 text-rose-500">{c.tax}</td>
                    <td className="p-3">{c.living}</td>
                    <td className="p-3 text-emerald-500 font-bold">{c.savings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* ROI Calculator */}
        <GlassCard className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Calculator size={14} /> Tuition ROI Calculator</h4>
          <form onSubmit={handleCalculate} className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Annual College Tuition</label>
              <input 
                type="number" 
                value={fees} 
                onChange={(e) => setFees(parseFloat(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border-none focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Monthly Living Expenses</label>
              <input 
                type="number" 
                value={living} 
                onChange={(e) => setLiving(parseFloat(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border-none focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Study Duration (Years)</label>
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border-none focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Total Scholarships Amount</label>
              <input 
                type="number" 
                value={scholarship} 
                onChange={(e) => setScholarship(parseFloat(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border-none focus:outline-none" 
              />
            </div>
            <div className="col-span-2">
              <label className="text-slate-400 block mb-1">Expected Starting Annual Salary</label>
              <input 
                type="number" 
                value={salary} 
                onChange={(e) => setSalary(parseFloat(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border-none focus:outline-none" 
              />
            </div>
            <button type="submit" className="col-span-2 btn-primary py-2.5 mt-2">Re-calculate ROI metrics</button>
          </form>

          {/* Results Output grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-150 dark:border-slate-800 text-[11px] font-bold">
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-slate-400 block text-[9px] uppercase">Net Investment</span>
              <span className="text-slate-800 dark:text-slate-200">₹{(roiResult.investment).toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-slate-400 block text-[9px] uppercase">Break-Even Time</span>
              <span className="text-brand-primary">{roiResult.breakEven} Years</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-slate-400 block text-[9px] uppercase">10-Yr ROI Percent</span>
              <span className="text-emerald-500">{roiResult.roiPercent}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-slate-400 block text-[9px] uppercase">10-Yr Net Career Value</span>
              <span className="text-indigo-500">₹{(roiResult.netValue).toLocaleString()}</span>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};
