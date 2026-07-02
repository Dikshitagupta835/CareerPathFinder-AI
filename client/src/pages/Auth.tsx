import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Mail, Lock, User, Phone, Eye, EyeOff, 
  ArrowLeft, Shield, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedAccount {
  email: string;
  fullName: string;
  avatarLetter: string;
}

export const Auth: React.FC = () => {
  const { login, signup, isAuthenticated } = useApp();
  const navigate = useNavigate();

  // Navigation Guard: if already logged in, go to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Auth Modes: 'signin' | 'signup' | 'otp' | 'picker' | 'returning'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'otp' | 'picker' | 'returning'>('signin');
  
  // Input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // Password visible states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP flow states
  const [otpStep, setOtpStep] = useState(1); // 1 = Phone Input, 2 = Code Input
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(30);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Saved accounts for return user detection
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [selectedReturningUser, setSelectedReturningUser] = useState<SavedAccount | null>(null);
  
  // Error / Loading states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Focus returning password on Scenario B load
  const returningPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load saved accounts from localStorage
    try {
      const saved = localStorage.getItem('cpf_saved_accounts');
      if (saved) {
        const parsed = JSON.parse(saved) as SavedAccount[];
        setSavedAccounts(parsed);
        if (parsed.length > 1) {
          setAuthMode('picker');
        } else if (parsed.length === 1) {
          setSelectedReturningUser(parsed[0]);
          setEmail(parsed[0].email);
          setAuthMode('returning');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Autofocus password when returning user is shown
  useEffect(() => {
    if (authMode === 'returning' && returningPasswordRef.current) {
      setTimeout(() => {
        returningPasswordRef.current?.focus();
      }, 300);
    }
  }, [authMode]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (authMode === 'otp' && otpStep === 2 && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [authMode, otpStep, resendCountdown]);

  // Calculate password strength index (0-4)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strengthColor = (score: number) => {
    if (score <= 1) return 'bg-rose-500';
    if (score === 2) return 'bg-amber-500';
    if (score === 3) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const strengthLabel = (score: number) => {
    if (score === 0) return '';
    if (score <= 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Strong';
    return 'Very Secure ✨';
  };

  // Auth Submit Handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
      // Save this account locally for the picker
      saveAccountDetails(email, selectedReturningUser?.fullName || email.split('@')[0]);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signup(fullName, email, password);
      saveAccountDetails(email, fullName);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAccountDetails = (userEmail: string, name: string) => {
    try {
      const savedStr = localStorage.getItem('cpf_saved_accounts');
      let current: SavedAccount[] = [];
      if (savedStr) {
        current = JSON.parse(savedStr);
      }
      // Remove duplicate
      current = current.filter(x => x.email.toLowerCase() !== userEmail.toLowerCase());
      current.unshift({
        email: userEmail.toLowerCase(),
        fullName: name,
        avatarLetter: name.charAt(0).toUpperCase()
      });
      // Limit to last 5 accounts
      current = current.slice(0, 5);
      localStorage.setItem('cpf_saved_accounts', JSON.stringify(current));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep(2);
      setResendCountdown(30);
    }, 1000);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // Auto-advance
    if (val && index < 5) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-submit on complete
    if (newOtp.every(x => x !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async (code: string) => {
    console.log("Verifying OTP code:", code);
    setIsLoading(true);
    setError('');
    // Mock successful OTP verification
    setTimeout(async () => {
      try {
        const mockEmail = `phone_${phone.replace(/\D/g, '')}@cpf.ai`;
        await signup(`Phone User`, mockEmail, 'password123');
        saveAccountDetails(mockEmail, 'Phone User');
      } catch (err: any) {
        setError(err.message || 'OTP verification failed.');
        setIsLoading(false);
      }
    }, 1200);
  };

  const handlePasteOtp = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    
    const chars = pasted.split('');
    const newOtp = [...otpCode];
    for (let i = 0; i < 6; i++) {
      if (chars[i]) newOtp[i] = chars[i];
    }
    setOtpCode(newOtp);
    
    // Focus last box
    const focusIdx = Math.min(chars.length, 5);
    otpRefs[focusIdx].current?.focus();

    if (newOtp.every(x => x !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-y-auto">
      {/* LEFT PANEL: 45% (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between w-[45%] bg-gradient-to-tr from-indigo-900 via-slate-900 to-indigo-950 p-12 text-white relative overflow-hidden border-r border-slate-850">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            C
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading tracking-tight leading-none">CareerPathFinder</h1>
            <p className="text-[9px] text-indigo-400 font-semibold uppercase tracking-widest mt-1">AI Career OS</p>
          </div>
        </div>

        {/* Tagline and Features */}
        <div className="space-y-8 my-auto max-w-sm">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-heading leading-tight tracking-tight">Discover Your Future.</h2>
            <p className="text-slate-400 text-sm">Powered by collaborative AI sub-agents.</p>
          </div>

          <div className="space-y-4">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-3 shadow-md backdrop-blur-sm"
            >
              <div className="text-indigo-400 mt-0.5">🔒</div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold font-heading">Your data, always synced</h4>
                <p className="text-[10px] text-slate-400">Sign in from any device. Your map is exactly where you left it.</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-3 shadow-md backdrop-blur-sm"
            >
              <div className="text-indigo-400 mt-0.5">🤖</div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold font-heading">AI Coach always ready</h4>
                <p className="text-[10px] text-slate-400">Ask questions, request roadmaps, and compare salaries on the fly.</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-3 shadow-md backdrop-blur-sm"
            >
              <div className="text-indigo-400 mt-0.5">🗺</div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold font-heading">Your roadmap, everywhere</h4>
                <p className="text-[10px] text-slate-400">A step-by-step path designed dynamically around your actual goals.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>Free to start · Your data stays yours</span>
          <span className="flex items-center gap-1"><Shield size={12} className="text-indigo-400" /> Secure Encryption</span>
        </div>
      </div>

      {/* RIGHT PANEL: 55% */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6">
        {/* Mobile Header Logo */}
        <div className="md:hidden flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            C
          </div>
          <h1 className="text-lg font-bold font-heading">CareerPathFinder</h1>
        </div>

        <div className="w-full max-w-[420px] space-y-6">
          
          {/* Error Notice */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs p-3.5 rounded-xl flex items-center gap-2.5">
              <span>⚠️</span>
              <p className="font-semibold leading-normal">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">

            {/* SCENARIO C: ACCOUNT PICKER */}
            {authMode === 'picker' && (
              <motion.div
                key="picker"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1.5 text-center">
                  <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">Choose your account</h2>
                  <p className="text-xs text-slate-450">Select an account to sign in back quickly</p>
                </div>

                <div className="space-y-3">
                  {savedAccounts.map((acct) => (
                    <div
                      key={acct.email}
                      onClick={() => {
                        setSelectedReturningUser(acct);
                        setEmail(acct.email);
                        setAuthMode('returning');
                      }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4 cursor-pointer select-none hover:shadow-md hover:border-indigo-500/35 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow">
                        {acct.avatarLetter}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 truncate">{acct.fullName}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{acct.email}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setEmail('');
                    setPassword('');
                    setAuthMode('signin');
                  }}
                  className="w-full text-center text-xs font-bold text-indigo-500 hover:underline block"
                >
                  + Sign in with a different account
                </button>
              </motion.div>
            )}

            {/* SCENARIO B: RETURNING USER CARD */}
            {authMode === 'returning' && selectedReturningUser && (
              <motion.div
                key="returning"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl shadow-lg border border-indigo-200 dark:border-slate-800">
                    {selectedReturningUser.avatarLetter}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">Welcome back, {selectedReturningUser.fullName} 👋</h2>
                    <p className="text-xs text-slate-450 mt-1">{selectedReturningUser.email}</p>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 px-4 h-14 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/40 transition-colors">
                      <Lock size={16} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        ref={returningPasswordRef}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-650"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 accent-indigo-600"
                      />
                      <span className="text-slate-400">Keep me signed in</span>
                    </label>
                    <button type="button" className="text-indigo-500 font-bold hover:underline">Forgot password?</button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-550 hover:to-indigo-500 text-white h-14 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In 🚀'}
                  </button>
                </form>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    onClick={() => {
                      if (savedAccounts.length > 1) {
                        setAuthMode('picker');
                      } else {
                        setAuthMode('signin');
                      }
                      setPassword('');
                    }}
                    className="text-indigo-500 font-bold hover:underline"
                  >
                    ← Switch account
                  </button>
                  <button
                    onClick={() => {
                      setEmail('');
                      setPassword('');
                      setAuthMode('signup');
                    }}
                    className="text-indigo-500 font-bold hover:underline"
                  >
                    Create new account →
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCENARIO D: NEW USER / GENERAL SIGN IN */}
            {authMode === 'signin' && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">Sign in to CareerPathFinder AI</h2>
                  <p className="text-xs text-slate-450">Unlock customized roadmaps, college matches, and ROI tools</p>
                </div>

                {/* Social logins */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => alert("Google sign in is supported. Authenticating...")}
                    className="h-13 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-sm text-xs font-bold flex items-center justify-center gap-2.5 transition-all"
                  >
                    <span>🌐</span> Google
                  </button>
                  <button
                    onClick={() => setAuthMode('otp')}
                    className="h-13 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-sm text-xs font-bold flex items-center justify-center gap-2.5 transition-all"
                  >
                    <span>📱</span> Phone OTP
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-350">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span>or email credentials</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 px-4 h-13 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/40 transition-colors">
                      <Mail size={16} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 px-4 h-13 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/40 transition-colors">
                      <Lock size={16} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-655"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 accent-indigo-600"
                      />
                      <span className="text-slate-400">Keep me signed in</span>
                    </label>
                    <button type="button" className="text-indigo-500 font-bold hover:underline">Forgot password?</button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-550 hover:to-indigo-500 text-white h-13 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In 🚀'}
                  </button>
                </form>

                <p className="text-center text-xs text-slate-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setError('');
                      setAuthMode('signup');
                    }}
                    className="text-indigo-500 font-bold hover:underline"
                  >
                    Create one free →
                  </button>
                </p>
              </motion.div>
            )}

            {/* SIGN UP FORM */}
            {authMode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">Create your account ✨</h2>
                  <p className="text-xs text-slate-450">Free to start. Saved everywhere dynamically.</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/40 transition-colors">
                      <User size={16} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/40 transition-colors">
                      <Mail size={16} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/40 transition-colors">
                      <Lock size={16} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-655"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-1.5 pt-1.5 px-0.5">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Password Strength</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{strengthLabel(getPasswordStrength(password))}</span>
                        </div>
                        <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                          {Array.from({ length: 4 }).map((_, idx) => (
                            <div 
                              key={idx} 
                              className={`h-full flex-1 transition-all duration-300 ${
                                idx < getPasswordStrength(password)
                                  ? strengthColor(getPasswordStrength(password))
                                  : 'bg-transparent'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/40 transition-colors">
                      <Lock size={16} className="text-slate-400 mr-3 shrink-0" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Verify password"
                        className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-slate-400 hover:text-slate-655"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11px] text-slate-400 py-1">
                    <input
                      type="checkbox"
                      required
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 accent-indigo-600 mt-0.5"
                    />
                    <span>I agree to the Terms of Service & Privacy Policy</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-550 hover:to-indigo-500 text-white h-13 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Creating Account...' : 'Create My Account 🚀'}
                  </button>
                </form>

                <p className="text-center text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setError('');
                      setAuthMode('signin');
                    }}
                    className="text-indigo-500 font-bold hover:underline"
                  >
                    Sign in →
                  </button>
                </p>
              </motion.div>
            )}

            {/* PHONE / OTP FLOW */}
            {authMode === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 -ml-2">
                  <button 
                    onClick={() => {
                      setError('');
                      setOtpStep(1);
                      setAuthMode('signin');
                    }}
                    className="p-2 text-slate-450 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-slate-400">Use regular Sign In</span>
                </div>

                {otpStep === 1 ? (
                  /* Step 1: Phone number entry */
                  <div className="space-y-5">
                    <div className="space-y-1.5 text-center">
                      <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">Phone Verification</h2>
                      <p className="text-xs text-slate-450">Enter your phone number to sign in or create an account with OTP</p>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-900 px-4 h-13 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500/40 transition-colors">
                          <Phone size={16} className="text-slate-400 mr-3 shrink-0" />
                          <span className="text-xs font-bold text-slate-450 border-r border-slate-200 dark:border-slate-800 pr-3 mr-3">+91</span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="98765 43210"
                            maxLength={10}
                            className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-250 w-full"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || phone.length < 10}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-550 hover:to-indigo-500 text-white h-13 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Sending OTP...' : 'Send OTP Code 💬'}
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Step 2: 6-digit OTP code entry */
                  <div className="space-y-5">
                    <div className="space-y-1.5 text-center">
                      <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">Verify Code</h2>
                      <p className="text-xs text-slate-450 leading-relaxed">
                        We sent a 6-digit verification code to <span className="font-bold text-slate-800 dark:text-slate-200">+91 {phone}</span>
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Code Input Boxes */}
                      <div className="flex justify-between gap-2.5">
                        {otpCode.map((digit, index) => (
                          <input
                            key={index}
                            ref={otpRefs[index]}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={handlePasteOtp}
                            className="w-12 h-13 text-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base font-bold text-slate-800 dark:text-slate-200 rounded-xl focus:border-indigo-500/50 focus:outline-none transition-colors"
                          />
                        ))}
                      </div>

                      <div className="flex flex-col items-center gap-2.5 text-xs text-slate-450">
                        {resendCountdown > 0 ? (
                          <span>Resend code in <span className="font-bold text-slate-700 dark:text-slate-350">{resendCountdown}s</span></span>
                        ) : (
                          <button
                            onClick={() => {
                              setResendCountdown(30);
                              alert("OTP resent successfully!");
                            }}
                            className="text-indigo-500 font-bold hover:underline"
                          >
                            Resend Verification Code
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            setOtpStep(1);
                            setOtpCode(['', '', '', '', '', '']);
                            setError('');
                          }}
                          className="text-slate-400 hover:text-slate-650 hover:underline text-[11px] mt-1"
                        >
                          Change phone number
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
