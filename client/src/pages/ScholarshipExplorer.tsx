import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';
import { 
  DollarSign, Search, Sparkles, Calculator 
} from 'lucide-react';

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  eligibility: string;
  minMarks: string;
  incomeCap: string;
  country: string;
  deadline: string;
  acceptanceRate: string;
  difficulty: string;
  requiredDocuments: string[];
  website: string;
  type: string;
  category: string;
}

export const ScholarshipExplorer: React.FC = () => {
  const { user, savedScholarships, toggleSaveScholarship, onboardingComplete } = useApp();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  
  // AI Eligibility check states
  const [userMarks, setUserMarks] = useState(user.marks ? user.marks.replace('%', '') : '90');
  const [userIncome, setUserIncome] = useState(user.familyIncome || 500000);
  const [checkResult, setCheckResult] = useState<{
    status: string;
    odds: string;
    advice: string;
  } | null>(null);

  // Funding Calculator states
  const [tuitionCost, setTuitionCost] = useState(1200000);
  const [scholarshipAward, setScholarshipAward] = useState(200000);
  const [livingExpense, setLivingExpense] = useState(300000); // annual

  const scholarshipsList: Scholarship[] = [
    {
      id: "lester-b-pearson",
      name: "Lester B. Pearson International Scholarship",
      provider: "University of Toronto",
      amount: "Full Tuition, Books, Incidental Fees, and Full Residence Support for 4 years (approx. $65,000/year)",
      eligibility: "International student, outstanding academic record, nominated by school counselor, planning to study at U of T.",
      minMarks: "95% in Class 12",
      incomeCap: "No strict limit (Merit-based)",
      country: "Canada",
      deadline: "November 30, 2026",
      acceptanceRate: "0.1% (Highly Competitive)",
      difficulty: "Hard",
      requiredDocuments: ["School nomination form", "Academic transcripts", "3 Essays", "2 Letters of recommendation"],
      website: "https://future.utoronto.ca/pearson/",
      type: "Merit Based",
      category: "International"
    },
    {
      id: "nsp-central-sector",
      name: "Central Sector Scheme of Scholarship for College and University Students",
      provider: "Ministry of Education, Government of India",
      amount: "₹12,000 per year for graduation, ₹20,000 per year for post-graduation",
      eligibility: "Indian national, above 80th percentile of successful candidates in Class 12, family income below ₹4.5 LPA.",
      minMarks: "80th percentile in board exams",
      incomeCap: "₹4,50,000 / year",
      country: "India",
      deadline: "October 31, 2026",
      acceptanceRate: "15% (Broad coverage)",
      difficulty: "Medium",
      requiredDocuments: ["Income certificate", "Class 12 Marksheet", "Aadhaar Card", "Bank account details", "Bonafide certificate"],
      website: "https://scholarships.gov.in/",
      type: "Need Based",
      category: "Government"
    },
    {
      id: "chevening-scholarship",
      name: "Chevening Scholarships",
      provider: "Government of United Kingdom (FCDO)",
      amount: "Full tuition fee coverage, monthly living allowance, return economy flights to UK, visa application fees",
      eligibility: "Citizen of Chevening-eligible country, agree to return to home country for 2 years post-study, completed undergraduate degree, 2 years work experience.",
      minMarks: "65%+ or GPA 3.3/4",
      incomeCap: "No limit",
      country: "United Kingdom",
      deadline: "November 03, 2026",
      acceptanceRate: "2% (Highly competitive)",
      difficulty: "Hard",
      requiredDocuments: ["Degree transcripts", "2 Reference letters", "4 Essays (Leadership, Networking)", "Valid passport"],
      website: "https://www.chevening.org/",
      type: "Merit Based",
      category: "International"
    },
    {
      id: "reliance-foundation",
      name: "Reliance Foundation Undergraduate Scholarships",
      provider: "Reliance Foundation",
      amount: "Up to ₹2,00,000 over the duration of the degree course",
      eligibility: "First-year undergraduate student in any stream, Indian national, family income less than ₹15 Lakhs (preference to below ₹2.5 Lakhs). Aptitude test required.",
      minMarks: "60% in Class 12",
      incomeCap: "₹15,00,000 / year",
      country: "India",
      deadline: "September 30, 2026",
      acceptanceRate: "8% (Test based)",
      difficulty: "Medium",
      requiredDocuments: ["Class 12 Marksheet", "Income proof", "Bonafide college letter", "Passport photo"],
      website: "https://www.scholarships.reliancefoundation.org/",
      type: "Need-cum-Merit",
      category: "Private"
    }
  ];

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const marksNum = parseFloat(userMarks) || 90;
    
    let status = "Eligible";
    let odds = "85%";
    let advice = "Your marks aggregate matches requirements perfectly. Maintain a strong recommendation letter stack to secure selection.";

    if (marksNum < 80) {
      status = "Not Eligible";
      odds = "10%";
      advice = "Most merit lists close above 80%. We suggest checking private need-based bursaries or vocational training grants.";
    } else if (marksNum < 90) {
      status = "Almost Eligible";
      odds = "55%";
      advice = "You are in the borderline percentile. Score well in board exams and write a stellar personal statement to double your selection probability.";
    }

    if (userIncome > 450000) {
      advice += " NOTE: Family income exceeds India Central Sector limits (₹4.5L), so focus on Merit-based awards instead.";
    }

    setCheckResult({ status, odds, advice });
  };

  const filteredScholarships = scholarshipsList.filter((s) => 
    s.name.toLowerCase().includes(searchVal.toLowerCase()) || s.provider.toLowerCase().includes(searchVal.toLowerCase())
  );

  // Funding calculations
  const remainingCost = Math.max(0, (tuitionCost + livingExpense) - scholarshipAward);

  if (!onboardingComplete) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <DollarSign size={22} className="text-brand-primary" /> Scholarship Explorer
          </h2>
          <p className="text-xs text-slate-400">Match grant programs, calculate tuition coverage margins, and run AI eligibility checks.</p>
        </div>

        <EmptyState
          illustration={
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="7" />
              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
              <path d="M12 5v6M9 8h6" />
            </svg>
          }
          heading="No scholarships found yet 💰"
          subtext="Complete your profile so AI can check your eligibility automatically."
          buttonText="Check My Eligibility"
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
          <DollarSign size={22} className="text-brand-primary" /> Scholarship Explorer
        </h2>
        <p className="text-xs text-slate-400">Match grant programs, calculate tuition coverage margins, and run AI eligibility checks.</p>
      </div>

      {/* Row 1: Search & cards list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left list column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-2 transition-colors">
            <Search size={15} className="text-slate-400" />
            <input 
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search scholarship name or provider..."
              className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
            />
          </div>

          <div className="space-y-4">
            {filteredScholarships.map((s) => {
              const isSaved = savedScholarships.includes(s.id);
              return (
                <div key={s.id} className="glass-panel p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div>
                        <span className="text-[10px] text-slate-450 uppercase font-bold">{s.provider}</span>
                        <h4 className="font-bold text-slate-850 dark:text-slate-100 text-xs md:text-sm font-heading">{s.name}</h4>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{s.type}</span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed">{s.eligibility}</p>
                    <p className="text-emerald-500 font-bold text-xs">Coverage: {s.amount}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 justify-between items-center text-[10px] border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="text-slate-400 font-medium">Deadline: <span className="text-slate-700 dark:text-slate-355 font-bold">{s.deadline}</span></span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleSaveScholarship(s.id)}
                        className="btn-secondary text-[10px] py-1 px-3"
                      >
                        {isSaved ? 'Bookmarked' : 'Save'}
                      </button>
                      <button 
                        onClick={() => window.open(s.website, '_blank')}
                        className="btn-primary text-[10px] py-1 px-3"
                      >
                        Apply Portal
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side: AI check & funding calculator */}
        <div className="space-y-6">
          
          {/* AI Eligibility Check */}
          <GlassCard className="p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Sparkles size={14} className="text-brand-primary" /> AI Eligibility Check</h4>
            
            <form onSubmit={handleCheckEligibility} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Your Marks Aggregate %</label>
                <input 
                  type="number" 
                  value={userMarks} 
                  onChange={(e) => setUserMarks(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border-none focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Annual Family Income (₹)</label>
                <input 
                  type="number" 
                  value={userIncome} 
                  onChange={(e) => setUserIncome(parseFloat(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border-none focus:outline-none" 
                />
              </div>
              <button type="submit" className="w-full btn-primary py-2.5 text-xs">Check Match Probability</button>
            </form>

            {checkResult && (
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/30 rounded-xl text-xs space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800 dark:text-slate-200">Status: {checkResult.status}</span>
                  <span className="text-brand-primary">Match: {checkResult.odds}</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{checkResult.advice}</p>
              </div>
            )}
          </GlassCard>

          {/* Funding Cost Calculator */}
          <GlassCard className="p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Calculator size={14} /> Annual Funding Balance</h4>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Estimated Annual Tuition</label>
                <input 
                  type="number" 
                  value={tuitionCost} 
                  onChange={(e) => setTuitionCost(parseFloat(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border-none focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Annual Living Cost</label>
                <input 
                  type="number" 
                  value={livingExpense} 
                  onChange={(e) => setLivingExpense(parseFloat(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border-none focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Scholarship Award Stipend</label>
                <input 
                  type="number" 
                  value={scholarshipAward} 
                  onChange={(e) => setScholarshipAward(parseFloat(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border-none focus:outline-none" 
                />
              </div>

              <div className="pt-3 border-t border-slate-150 dark:border-slate-850 flex justify-between font-bold text-[11px]">
                <span className="text-slate-450">Out of Pocket balance:</span>
                <span className="text-indigo-550">₹{remainingCost.toLocaleString()} / year</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>
    </div>
  );
};
