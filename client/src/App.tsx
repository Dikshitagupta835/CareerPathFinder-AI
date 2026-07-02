import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { FloatingAssistant } from './components/FloatingAssistant';

// Pages
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { CareerDiscovery } from './pages/CareerDiscovery';
import { Comparison } from './pages/Comparison';
import { Roadmap } from './pages/Roadmap';
import { CareerUniverse } from './pages/CareerUniverse';
import { CollegeExplorer } from './pages/CollegeExplorer';
import { ScholarshipExplorer } from './pages/ScholarshipExplorer';
import { CountryExplorer } from './pages/CountryExplorer';
import { SalaryExplorer } from './pages/SalaryExplorer';
import { CareerReport } from './pages/CareerReport';
import { Settings } from './pages/Settings';

// Private Layout wrapper
const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useApp();
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar onLogout={logout} />

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopNav />
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
        {/* Floating Coach */}
        <FloatingAssistant />
      </div>
    </div>
  );
};

// Protected route guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, onboardingComplete, isRestoringSession } = useApp();
  const location = useLocation();

  if (isRestoringSession) {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 transition-colors duration-200">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 dark:border-indigo-500/5 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
        </div>
        <p className="text-xs font-bold text-slate-450 animate-pulse">Restoring Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

// Auth route guard (redirects already logged in users)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, onboardingComplete, isRestoringSession } = useApp();

  if (isRestoringSession) {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 transition-colors duration-200">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 dark:border-indigo-500/5 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (onboardingComplete) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Route */}
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        
        {/* Onboarding Route */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

        {/* Private Routes wrapping under Layout */}
        <Route path="/dashboard" element={<ProtectedRoute><PrivateLayout><Dashboard /></PrivateLayout></ProtectedRoute>} />
        <Route path="/career-discovery" element={<ProtectedRoute><PrivateLayout><CareerDiscovery /></PrivateLayout></ProtectedRoute>} />
        <Route path="/career-comparison" element={<ProtectedRoute><PrivateLayout><Comparison /></PrivateLayout></ProtectedRoute>} />
        <Route path="/career-roadmap" element={<ProtectedRoute><PrivateLayout><Roadmap /></PrivateLayout></ProtectedRoute>} />
        <Route path="/career-universe" element={<ProtectedRoute><PrivateLayout><CareerUniverse /></PrivateLayout></ProtectedRoute>} />
        <Route path="/colleges" element={<ProtectedRoute><PrivateLayout><CollegeExplorer /></PrivateLayout></ProtectedRoute>} />
        <Route path="/scholarships" element={<ProtectedRoute><PrivateLayout><ScholarshipExplorer /></PrivateLayout></ProtectedRoute>} />
        <Route path="/countries" element={<ProtectedRoute><PrivateLayout><CountryExplorer /></PrivateLayout></ProtectedRoute>} />
        <Route path="/salary-explorer" element={<ProtectedRoute><PrivateLayout><SalaryExplorer /></PrivateLayout></ProtectedRoute>} />
        <Route path="/ai-report" element={<ProtectedRoute><PrivateLayout><CareerReport /></PrivateLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PrivateLayout><Settings /></PrivateLayout></ProtectedRoute>} />

        {/* Fallback redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
