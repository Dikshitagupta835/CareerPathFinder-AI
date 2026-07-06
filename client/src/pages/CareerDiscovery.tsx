import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIWorkspace } from './AIWorkspace';

export const CareerDiscovery: React.FC = () => {
  const { onboardingComplete } = useApp();
  const navigate = useNavigate();

  if (onboardingComplete) {
    return <AIWorkspace />;
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <EmptyState
        illustration={<MessageSquare size={36} className="text-indigo-650" />}
        heading="Your future starts with one conversation"
        subtext="Answer a few quick questions — no long forms."
        buttonText="Begin 🚀"
        onButtonClick={() => navigate('/onboarding')}
      />
    </div>
  );
};
