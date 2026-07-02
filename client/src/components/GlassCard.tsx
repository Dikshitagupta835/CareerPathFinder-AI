import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', glow = false, ...props }) => {
  return (
    <div 
      className={`glass-card p-5 relative overflow-hidden ${
        glow ? 'after:absolute after:inset-0 after:rounded-glass after:border after:border-indigo-500/25 after:pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
