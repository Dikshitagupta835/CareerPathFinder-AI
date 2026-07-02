import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, UserProfile } from '../context/AppContext';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Onboarding: React.FC = () => {
  const { user, updateUser, syncUser, isAuthenticated } = useApp();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Questions configuration
  const questions = [
    {
      key: 'name',
      q: "👋 Welcome! Let's build your AI career blueprint. First, what should we call you?",
      type: 'text',
      placeholder: 'Enter your full name',
    },
    {
      key: 'educationLevel',
      q: "What is your current education level?",
      type: 'select',
      options: ['Class 10', 'Class 11', 'Class 12', 'Undergraduate', 'Postgraduate', 'Working Professional']
    },
    {
      key: 'degree',
      q: "What is your current stream/degree track?",
      type: 'select',
      options: ['Commerce', 'Science (PCM)', 'Science (PCB)', 'Arts & Humanities', 'Management/BBA', 'Engineering', 'Other']
    },
    {
      key: 'preferredCountry',
      q: "Which country would you most like to study or work in?",
      type: 'select',
      options: ['India', 'Canada', 'Germany', 'Australia', 'United Kingdom', 'Singapore', 'United States']
    },
    {
      key: 'subjects',
      q: "Which subjects do you enjoy studying most?",
      type: 'chips',
      options: ['Accountancy', 'Economics', 'Business Studies', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History', 'Pol Science', 'Arts']
    },
    {
      key: 'interests',
      q: "Which activities excite you the most?",
      type: 'chips',
      options: ['Solving Problems', 'Leading Teams', 'Building Businesses', 'Helping People', 'Teaching', 'Coding', 'Travelling', 'Creating Content', 'Research', 'Managing Money']
    },
    {
      key: 'workStyle',
      q: "What is your preferred work style?",
      type: 'select',
      options: ['Office-based', 'Fully Remote', 'Hybrid model', 'Field work', 'Entrepreneurship', 'Freelancing']
    },
    {
      key: 'budget',
      q: "What is your total education budget limit?",
      type: 'range',
      min: 100000,
      max: 5000000,
      step: 100000,
      format: (val: number) => `₹${(val / 100000).toFixed(1)} Lakhs`
    },
    {
      key: 'familyIncome',
      q: "What is your annual family income? (helps matching need-based scholarships)",
      type: 'range',
      min: 100000,
      max: 3000000,
      step: 50000,
      format: (val: number) => `₹${(val / 100000).toFixed(1)} Lakhs`
    },
    {
      key: 'marks',
      q: "What is your latest aggregate marks percentage or percentile?",
      type: 'select',
      options: ['95% or above', '90% - 94%', '80% - 89%', '70% - 79%', 'Below 70%']
    },
    {
      key: 'skills',
      q: "Select any skills you are already familiar with:",
      type: 'chips',
      options: ['Excel', 'Communication', 'Accounting', 'Public Speaking', 'Programming', 'Data Analysis', 'Leadership', 'Writing']
    },
    {
      key: 'workLifeBalance',
      q: "How do you prioritize work-life balance vs salary?",
      type: 'select',
      options: ['Balanced Life first', 'Salary/Compensation first', 'Rapid Career Growth first', 'No strong preference']
    }
  ];

  // Local state for wizard progress
  const [step, setStep] = useState(0);
  
  // Local profile temporary workspace (starts with current database user profile or default empty)
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing Profile...');

  // Pull initial data from logged in user
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        age: user.age || 17,
        educationLevel: user.educationLevel || '',
        degree: user.degree || '',
        subjects: user.subjects || [],
        skills: user.skills || [],
        budget: user.budget || 1000000,
        preferredCountry: user.preferredCountry || '',
        familyIncome: user.familyIncome || 500000,
        marks: user.marks || '',
        interests: user.interests || [],
        careerGoals: user.careerGoals || []
      });
      
      // If user has saved progress step, load it
      if (user.onboardingStep !== undefined && user.onboardingStep > 0 && user.onboardingStep < questions.length) {
        setStep(user.onboardingStep);
      }
    }
  }, [user]);

  const currentQuestion = questions[step];

  // Handle single selection / text input change
  const handleValueChange = (val: any) => {
    setProfileData(prev => ({
      ...prev,
      [currentQuestion.key]: val
    }));
  };

  // Handle chips multiple selection (add/remove from list)
  const handleChipToggle = (option: string) => {
    const currentList = (profileData[currentQuestion.key as keyof UserProfile] as string[]) || [];
    let newList: string[];
    
    if (currentList.includes(option)) {
      newList = currentList.filter(x => x !== option);
    } else {
      newList = [...currentList, option];
    }
    
    setProfileData(prev => ({
      ...prev,
      [currentQuestion.key]: newList
    }));
  };

  const handleNext = async () => {
    // Sync current step state back to database for cross-device mid-way resume capability
    const nextStep = step + 1;
    
    if (step < questions.length - 1) {
      setStep(nextStep);
      // Sync in background
      await syncUser({ 
        profile: { ...user, ...profileData } as UserProfile,
        onboardingStep: nextStep
      });
    } else {
      // Completed Onboarding!
      setIsLoading(true);
      setLoadingText('Orchestrating AI recommendations...');
      
      try {
        const finalProfile = {
          ...user,
          ...profileData,
          name: profileData.name || user.name || 'User',
          careerGoals: profileData.interests?.map(i => `Excel in ${i}`) || ['Discover Careers']
        } as UserProfile;

        // Save complete profile, mark onboardingComplete, generate matches
        await updateUser(finalProfile);
        
        // Final sync
        await syncUser({
          profile: finalProfile,
          onboardingComplete: true,
          onboardingStep: 0
        });

        setIsLoading(false);
        navigate('/dashboard');
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const isAnswered = () => {
    const val = profileData[currentQuestion.key as keyof UserProfile];
    if (val === undefined || val === null) return false;
    if (typeof val === 'string' && val.trim() === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 transition-colors">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 dark:border-indigo-500/5 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
        </div>
        <p className="font-heading text-sm font-bold text-slate-800 dark:text-slate-200 animate-pulse">{loadingText}</p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between overflow-y-auto py-8">
      {/* Onboarding Wizard Header */}
      <header className="max-w-2xl w-full mx-auto px-6 space-y-4">
        <div className="flex justify-between items-center text-[10px] font-bold text-indigo-550 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Sparkles size={11} /> AI Assistant</span>
          <span>Question {step + 1} of {questions.length}</span>
        </div>

        {/* Progress Bar (Indigo) */}
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden transition-all">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-2xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 rounded-3xl shadow-md min-h-[320px] flex flex-col justify-between gap-6"
          >
            {/* Question Text */}
            <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {currentQuestion.q}
            </h2>

            {/* Input Renders based on type */}
            <div className="flex-1 flex flex-col justify-center py-2">
              
              {/* Text Input */}
              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  value={(profileData[currentQuestion.key as keyof UserProfile] as string) || ''}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full bg-slate-100 dark:bg-slate-850 p-4 h-14 rounded-xl border border-slate-250 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500/55 text-slate-700 dark:text-slate-250"
                  autoFocus
                />
              )}

              {/* Selection Options List */}
              {currentQuestion.type === 'select' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options?.map((option) => {
                    const isSelected = profileData[currentQuestion.key as keyof UserProfile] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => handleValueChange(option)}
                        className={`h-14 px-4 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all select-none ${
                          isSelected 
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{option}</span>
                        {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Multiple selection chips */}
              {currentQuestion.type === 'chips' && (
                <div className="flex flex-wrap gap-2.5">
                  {currentQuestion.options?.map((option) => {
                    const list = (profileData[currentQuestion.key as keyof UserProfile] as string[]) || [];
                    const isSelected = list.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => handleChipToggle(option)}
                        className={`px-4 py-2.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all select-none ${
                          isSelected
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-sm animate-pulse-once'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Budget slider/range selection */}
              {currentQuestion.type === 'range' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Limit</span>
                    <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading">
                      {(currentQuestion as any).format ? (currentQuestion as any).format((profileData[currentQuestion.key as keyof UserProfile] as number) || (currentQuestion as any).min) : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={(currentQuestion as any).min}
                    max={(currentQuestion as any).max}
                    step={(currentQuestion as any).step}
                    value={(profileData[currentQuestion.key as keyof UserProfile] as number) || (currentQuestion as any).min}
                    onChange={(e) => handleValueChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-250 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>{(currentQuestion as any).format ? (currentQuestion as any).format((currentQuestion as any).min) : ''}</span>
                    <span>{(currentQuestion as any).format ? (currentQuestion as any).format((currentQuestion as any).max) : ''}</span>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Buttons footer */}
      <footer className="max-w-2xl w-full mx-auto px-6 flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            step === 0 
              ? 'opacity-30 cursor-not-allowed text-slate-400' 
              : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <ChevronLeft size={16} /> Back
        </button>

        <button
          onClick={handleNext}
          disabled={!isAnswered()}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-550 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === questions.length - 1 ? 'Finish Onboarding 🚀' : 'Continue'}
          <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
};
