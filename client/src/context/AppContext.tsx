import React, { createContext, useState, useEffect, useContext } from 'react';

// Type definitions
export interface UserProfile {
  name: string;
  age: number;
  educationLevel: string;
  degree: string;
  subjects: string[];
  skills: string[];
  budget: number; // in INR
  preferredCountry: string;
  familyIncome: number;
  marks: string; // percentage/percentile
  interests: string[];
  careerGoals: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  agent?: string;
  widgets?: {
    careers?: any[];
    colleges?: any[];
    scholarships?: any[];
    salary?: any;
    country?: any;
    roadmap?: any[];
    skills?: any;
  };
}

interface AppContextType {
  user: UserProfile & { onboardingStep?: number };
  updateUser: (profile: Partial<UserProfile>) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  savedCareers: string[];
  toggleSaveCareer: (id: string) => void;
  savedColleges: string[];
  toggleSaveCollege: (id: string) => void;
  savedScholarships: string[];
  toggleSaveScholarship: (id: string) => void;
  chatOpen: boolean;
  setChatOpen: (val: boolean) => void;
  chatHistory: ChatMessage[];
  sendChatMessage: (message: string) => Promise<void>;
  isThinking: boolean;
  thinkingAgent: string;
  recommendations: any;
  loadingRecommendations: boolean;
  refreshRecommendations: () => Promise<void>;
  
  // Auth system exports
  token: string | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  login: (email: string, pass: string, rememberMe: boolean) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  syncUser: (fieldsToSync: {
    profile?: UserProfile;
    onboardingComplete?: boolean;
    onboardingStep?: number;
    savedCareers?: string[];
    savedColleges?: string[];
    savedScholarships?: string[];
    chatHistory?: ChatMessage[];
    recommendations?: any;
  }) => Promise<void>;
  isRestoringSession: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || '';

const initialProfile: UserProfile & { onboardingStep?: number } = {
  name: "",
  age: 0,
  educationLevel: "",
  degree: "",
  subjects: [],
  skills: [],
  budget: 0,
  preferredCountry: "",
  familyIncome: 0,
  marks: "",
  interests: [],
  careerGoals: [],
  onboardingStep: 0
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cpf_token') || sessionStorage.getItem('cpf_token');
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  const [isRestoringSession, setIsRestoringSession] = useState<boolean>(true);

  const [user, setUser] = useState<UserProfile & { onboardingStep?: number }>(initialProfile);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cpf_theme');
    return saved ? saved === 'dark' : false;
  });

  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingAgent, setThinkingAgent] = useState('Orchestrator Agent');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const [recommendations, setRecommendations] = useState<any>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Apply dark class to HTML node
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('cpf_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cpf_theme', 'light');
    }
  }, [darkMode]);

  // Silent session restore on app load
  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setIsRestoringSession(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user.profile || { ...initialProfile, name: data.user.fullName, onboardingStep: data.user.onboardingStep });
          setSavedCareers(data.user.savedCareers || []);
          setSavedColleges(data.user.savedColleges || []);
          setSavedScholarships(data.user.savedScholarships || []);
          setChatHistory(data.user.chatHistory || []);
          setRecommendations(data.user.recommendations || null);
          setOnboardingComplete(data.user.onboardingComplete);
          setIsAuthenticated(true);
        } else {
          // Token expired or invalid
          handleLogoutCleanup();
        }
      } catch (e) {
        console.error("Session restoration failed:", e);
        // Fall back to offline cached profile if exists, but require login
        handleLogoutCleanup();
      } finally {
        setIsRestoringSession(false);
      }
    };

    restoreSession();
  }, [token]);

  const handleLogoutCleanup = () => {
    localStorage.removeItem('cpf_token');
    sessionStorage.removeItem('cpf_token');
    setToken(null);
    setIsAuthenticated(false);
    setOnboardingComplete(false);
    setUser(initialProfile);
    setSavedCareers([]);
    setSavedColleges([]);
    setSavedScholarships([]);
    setChatHistory([]);
    setRecommendations(null);
  };

  // Auth Operations
  const login = async (email: string, pass: string, rememberMe: boolean) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    if (response.ok) {
      const data = await response.json();
      if (rememberMe) {
        localStorage.setItem('cpf_token', data.token);
      } else {
        sessionStorage.setItem('cpf_token', data.token);
      }
      setToken(data.token);
      setUser(data.user.profile || { ...initialProfile, name: data.user.fullName, onboardingStep: data.user.onboardingStep });
      setSavedCareers(data.user.savedCareers || []);
      setSavedColleges(data.user.savedColleges || []);
      setSavedScholarships(data.user.savedScholarships || []);
      setChatHistory(data.user.chatHistory || []);
      setRecommendations(data.user.recommendations || null);
      setOnboardingComplete(data.user.onboardingComplete);
      setIsAuthenticated(true);
    } else {
      const errData = await response.json();
      throw new Error(errData.error || "Login failed");
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: name, email, password: pass })
    });
    if (response.ok) {
      const data = await response.json();
      // By default keep signed in
      localStorage.setItem('cpf_token', data.token);
      setToken(data.token);
      setUser(data.user.profile || { ...initialProfile, name: data.user.fullName, onboardingStep: data.user.onboardingStep });
      setSavedCareers(data.user.savedCareers || []);
      setSavedColleges(data.user.savedColleges || []);
      setSavedScholarships(data.user.savedScholarships || []);
      setChatHistory(data.user.chatHistory || []);
      setRecommendations(data.user.recommendations || null);
      setOnboardingComplete(data.user.onboardingComplete);
      setIsAuthenticated(true);
    } else {
      const errData = await response.json();
      throw new Error(errData.error || "Registration failed");
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.error(e);
      }
    }
    handleLogoutCleanup();
  };

  const syncUser = async (fieldsToSync: Parameters<AppContextType['syncUser']>[0]) => {
    if (!token) return;
    try {
      const payload: any = {};
      if (fieldsToSync.profile !== undefined) payload.profile = fieldsToSync.profile;
      if (fieldsToSync.onboardingComplete !== undefined) {
        payload.onboardingComplete = fieldsToSync.onboardingComplete;
        setOnboardingComplete(fieldsToSync.onboardingComplete);
      }
      if (fieldsToSync.onboardingStep !== undefined) payload.onboardingStep = fieldsToSync.onboardingStep;
      if (fieldsToSync.savedCareers !== undefined) payload.savedCareers = fieldsToSync.savedCareers;
      if (fieldsToSync.savedColleges !== undefined) payload.savedColleges = fieldsToSync.savedColleges;
      if (fieldsToSync.savedScholarships !== undefined) payload.savedScholarships = fieldsToSync.savedScholarships;
      if (fieldsToSync.chatHistory !== undefined) payload.chatHistory = fieldsToSync.chatHistory;
      if (fieldsToSync.recommendations !== undefined) payload.recommendations = fieldsToSync.recommendations;

      const response = await fetch(`${API_URL}/api/user/sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        // Update local user state
        if (data.user.profile) {
          setUser(prev => ({ ...prev, ...data.user.profile, onboardingStep: data.user.onboardingStep }));
        }
      }
    } catch (e) {
      console.warn("Could not sync data to server:", e);
    }
  };

  const updateUser = (profile: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...profile };
      // Trigger background sync
      syncUser({ profile: next as UserProfile });
      return next;
    });
  };

  const toggleSaveCareer = (id: string) => {
    setSavedCareers(prev => {
      const next = prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id];
      syncUser({ savedCareers: next });
      return next;
    });
  };

  const toggleSaveCollege = (id: string) => {
    setSavedColleges(prev => {
      const next = prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id];
      syncUser({ savedColleges: next });
      return next;
    });
  };

  const toggleSaveScholarship = (id: string) => {
    setSavedScholarships(prev => {
      const next = prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id];
      syncUser({ savedScholarships: next });
      return next;
    });
  };

  const refreshRecommendations = async () => {
    if (!token) return;
    setLoadingRecommendations(true);
    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile: user })
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
        syncUser({ recommendations: data });
      } else {
        throw new Error("API call failed");
      }
    } catch (e) {
      console.warn("Could not reach backend recommendations API.");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const sendChatMessage = async (text: string) => {
    if (!token) return;
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    syncUser({ chatHistory: updatedHistory });
    
    setIsThinking(true);
    setThinkingAgent('Orchestrator Agent');

    const agentSequence = [
      'Career Recommendation Agent',
      'Salary Intelligence Agent',
      'College Agent',
      'Roadmap Planner Agent',
      'Orchestrator Agent (Completed)'
    ];

    let currentAgentIdx = 0;
    const interval = setInterval(() => {
      if (currentAgentIdx < agentSequence.length) {
        setThinkingAgent(agentSequence[currentAgentIdx]);
        currentAgentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 900);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profile: user, query: text })
      });
      clearInterval(interval);
      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'ai',
          text: data.summary || "I've structured the recommendation dashboard to show these insights.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agent: data.activeAgent || "Orchestrator Agent",
          widgets: {
            careers: data.careers,
            colleges: data.colleges,
            scholarships: data.scholarships,
            salary: data.salary,
            country: data.country,
            roadmap: data.roadmap,
            skills: data.skills
          }
        };
        const nextHistory = [...updatedHistory, aiMsg];
        setChatHistory(nextHistory);
        syncUser({ chatHistory: nextHistory });
      } else {
        throw new Error("Chat API failed");
      }
    } catch (e) {
      console.warn("Backend chat unavailable, generating custom message.");
      clearInterval(interval);
      
      const fallbackMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: "I analyzed your query, but the AI service is currently starting. Try again in a brief moment, or let me know what profile updates you'd like to sync!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: "Orchestrator Agent (Fallback)"
      };
      
      const nextHistory = [...updatedHistory, fallbackMsg];
      setChatHistory(nextHistory);
      syncUser({ chatHistory: nextHistory });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      updateUser,
      darkMode,
      setDarkMode,
      savedCareers,
      toggleSaveCareer,
      savedColleges,
      toggleSaveCollege,
      savedScholarships,
      toggleSaveScholarship,
      chatOpen,
      setChatOpen,
      chatHistory,
      sendChatMessage,
      isThinking,
      thinkingAgent,
      recommendations,
      loadingRecommendations,
      refreshRecommendations,
      
      // Auth fields
      token,
      isAuthenticated,
      onboardingComplete,
      login,
      signup,
      logout,
      syncUser,
      isRestoringSession
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
};
