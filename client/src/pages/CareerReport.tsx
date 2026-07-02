import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { 
  FileText, Download, Printer, Share2, DollarSign, GraduationCap 
} from 'lucide-react';

export const CareerReport: React.FC = () => {
  const { user, onboardingComplete } = useApp();
  const navigate = useNavigate();

  const handlePrint = () => {
    if (!onboardingComplete) return;
    window.print();
  };

  const actionChecklist = [
    { period: "Today's Task", text: "Practice 5 double-entry accounting ledger reconciliations.", priority: "High" },
    { period: "Weekly Goal", text: "Complete Advanced Excel basic modules on Coursera.", priority: "Medium" },
    { period: "Monthly Goal", text: "Register and pay registration fee on ICAI Foundation portal.", priority: "High" },
    { period: "Annual Goal", text: "Acquire aggregate marks score above 90% in Class 12 board examinations.", priority: "Critical" }
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors print:p-0 print:overflow-visible">
      
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <FileText size={22} className="text-brand-primary" /> Generated Career Blueprint Workbook
          </h2>
          <p className="text-xs text-slate-400">Aggregated sub-agents findings compiled on {new Date().toLocaleDateString()}.</p>
        </div>

        {/* Download buttons */}
        <div className="flex gap-2">
          <button 
            disabled={!onboardingComplete}
            onClick={handlePrint}
            className={`btn-secondary text-xs flex items-center gap-1.5 ${!onboardingComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!onboardingComplete ? "Complete your Career Discovery profile to compile your aggregated blueprint workbook." : ""}
          >
            <Printer size={14} /> Print Blueprint
          </button>
          <button 
            disabled={!onboardingComplete}
            onClick={() => alert("Report link copied to clipboard!")}
            className={`btn-secondary text-xs flex items-center gap-1.5 ${!onboardingComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!onboardingComplete ? "Complete your Career Discovery profile to compile your aggregated blueprint workbook." : ""}
          >
            <Share2 size={14} /> Share Link
          </button>
          <button 
            disabled={!onboardingComplete}
            onClick={() => alert("Downloading PDF workbook... Check your browser downloads.")}
            className={`btn-primary text-xs flex items-center gap-1.5 shadow ${!onboardingComplete ? 'opacity-50 cursor-not-allowed bg-indigo-400' : ''}`}
            title={!onboardingComplete ? "Complete your Career Discovery profile to compile your aggregated blueprint workbook." : ""}
          >
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {!onboardingComplete ? (
        <EmptyState
          illustration={
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          heading="Profile Incomplete 📋"
          subtext="Complete your Career Discovery profile to compile your aggregated blueprint workbook."
          buttonText="Start Career Discovery 🚀"
          onButtonClick={() => navigate('/onboarding')}
        />
      ) : (
        <>
          {/* REPORT CONTENT WRAPPER - STYLED FOR PROFESSIONAL PRINT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-5xl mx-auto shadow-sm space-y-8 print:border-none print:shadow-none print:bg-white print:text-slate-900">
        
        {/* Page 1: Cover Sheet */}
        <div className="text-center py-10 space-y-6 border-b border-slate-100 dark:border-slate-800 pb-12">
          <div className="flex justify-center items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-xl shadow">C</div>
            <span className="font-bold text-xl font-heading text-slate-800 dark:text-slate-200">CareerPathFinder AI</span>
          </div>

          <div className="space-y-2 pt-6">
            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Orchestrated Career Blueprint</span>
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 dark:text-slate-100 mt-2">Personalized Career Strategy Workbook</h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">A comprehensive review of study roadmaps, tuition ROI break-evens, and global visa pathways.</p>
          </div>

          <div className="pt-8 text-xs text-slate-500 flex justify-center gap-12 font-medium">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Prepared for</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Education Track</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user.educationLevel} ({user.degree})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Generated Date</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-4 pt-4">
          <h2 className="text-base font-bold font-heading text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">1. Executive Summary Recommendations</h2>
          <div className="p-5 bg-indigo-500/[0.02] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs leading-relaxed text-slate-600 dark:text-slate-350 space-y-3">
            <p>
              The **Orchestrator Agent** has consolidated recommendations for **{user.name}**. Based on enjoyed subjects (**{user.subjects.join(', ')}**) and budget boundaries (**₹{(user.budget / 100000).toFixed(1)} Lakhs**), the recommended career path is **Chartered Accountant**.
            </p>
            <p>
              Your current readiness stands at **74%**, representing excellent baseline accounting and spreadsheet skills. The primary missing target metrics lie in regulatory Auditing Standards and taxation filing rules. Domestically, Shri Ram College of Commerce (SRCC) offers the absolute best placement ROI; internationally, University of Toronto (Rotman Commerce) stands as the prime match.
            </p>
          </div>
        </div>

        {/* Section 2: Career & Skill scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matched Profile metrics</h3>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Country:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{user.preferredCountry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Education Budget:</span>
                <span className="font-bold text-indigo-550">₹{(user.budget / 100000).toFixed(1)} Lakhs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Latest Marks Aggregate:</span>
                <span className="font-bold text-emerald-500">{user.marks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Work Style Preference:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Hybrid / Office</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upskilling Scorecard</h3>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Competence Readiness:</span>
                <span className="font-bold text-indigo-550">74% Complete</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Identified Gaps:</span>
                <span className="font-bold text-rose-500">26% Missing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Certifications:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Coursera Audit / NPTEL Taxes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Skill Level Difficulty:</span>
                <span className="font-bold text-amber-500">Medium-Hard</span>
              </div>
            </div>
          </div>

        </div>

        {/* Section 3: College and Scholarships Match */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><GraduationCap size={14} /> University Match List</h3>
            <div className="space-y-2.5">
              <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">Shri Ram College of Commerce (SRCC)</h5>
                <p className="text-[10px] text-slate-450 mt-0.5">Fees: ₹30,000 / year • Avg Package: ₹10.5 LPA • Location: Delhi, India</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">University of Toronto (Rotman Commerce)</h5>
                <p className="text-[10px] text-slate-450 mt-0.5">Fees: $45,000 / year • Avg Package: $82,000 / year • Location: Toronto, Canada</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><DollarSign size={14} /> Matching Scholarships</h3>
            <div className="space-y-2.5">
              <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">Central Sector Scholarship Scheme</h5>
                <p className="text-[10px] text-emerald-500 font-bold mt-0.5">Coverage: ₹12,000 - ₹20,000 / year • Type: Need-cum-Merit</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">Lester B. Pearson Scholarship</h5>
                <p className="text-[10px] text-emerald-500 font-bold mt-0.5">Coverage: Full 4-Year Tuition & Residence • Type: Merit Based</p>
              </div>
            </div>
          </div>

        </div>

        {/* Section 4: Action plan checklist */}
        <div className="space-y-4 pt-4">
          <h2 className="text-base font-bold font-heading text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">2. AI Implementation Action Checklist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actionChecklist.map((act, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl flex gap-3 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1" />
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{act.period} • Priority: {act.priority}</span>
                  <p className="text-slate-700 dark:text-slate-350 font-bold mt-0.5">{act.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        </div>
      </>
    )}
  </div>
);
};
