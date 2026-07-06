import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { EmptyState } from '../components/EmptyState';
import { Network } from 'lucide-react';

interface CareerNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'core' | 'related' | 'advanced' | 'alternative';
  salary: string;
  demand: string;
  aiRisk: string;
  skills: string[];
}

export const CareerUniverse: React.FC = () => {
  const { onboardingComplete } = useApp();
  const navigate = useNavigate();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ca');
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Pre-defined nodes representing the tree structure
  const nodes: CareerNode[] = [
    { id: 'ca', name: 'Chartered Accountant', x: 250, y: 180, type: 'core', salary: '₹8.5 LPA', demand: 'High', aiRisk: '22%', skills: ['Accounting', 'Audit', 'Taxation'] },
    { id: 'auditor', name: 'Senior Auditor', x: 100, y: 80, type: 'advanced', salary: '₹12.0 LPA', demand: 'High', aiRisk: '15%', skills: ['Compliance', 'Auditing Standards'] },
    { id: 'fin-manager', name: 'Finance Manager', x: 400, y: 80, type: 'advanced', salary: '₹15.0 LPA', demand: 'High', aiRisk: '12%', skills: ['Strategic Planning', 'Forecasting'] },
    { id: 'cfo', name: 'Chief Financial Officer (CFO)', x: 250, y: 40, type: 'advanced', salary: '₹35.0+ LPA', demand: 'High', aiRisk: '8%', skills: ['Corporate Governance', 'M&A'] },
    
    { id: 'inv-banker', name: 'Investment Banker', x: 100, y: 280, type: 'alternative', salary: '₹15.0 LPA', demand: 'Very High', aiRisk: '12%', skills: ['Valuation', 'M&A', 'Financial Modelling'] },
    { id: 'fin-analyst', name: 'Financial Analyst', x: 400, y: 280, type: 'related', salary: '₹7.5 LPA', demand: 'High', aiRisk: '45%', skills: ['Excel', 'Market Analysis'] },
    { id: 'entrepreneur', name: 'Fintech Entrepreneur', x: 250, y: 340, type: 'alternative', salary: 'Unlimited', demand: 'High', aiRisk: '5%', skills: ['Leadership', 'Sales', 'Fundraising'] }
  ];

  // Pre-defined connections between nodes
  const links = [
    { source: 'ca', target: 'auditor' },
    { source: 'ca', target: 'fin-manager' },
    { source: 'auditor', target: 'cfo' },
    { source: 'fin-manager', target: 'cfo' },
    { source: 'ca', target: 'inv-banker' },
    { source: 'ca', target: 'fin-analyst' },
    { source: 'inv-banker', target: 'entrepreneur' },
    { source: 'fin-analyst', target: 'entrepreneur' }
  ];

  // Drag and Pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + factor)));
  };

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  if (!onboardingComplete) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-y-auto h-full select-none pb-24 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-heading">
            <Network size={22} className="text-brand-primary" /> Career Universe Map
          </h2>
          <p className="text-xs text-slate-400">Examine how various paths connect dynamically using an interactive nodes tree.</p>
        </div>

        <EmptyState
          illustration={
            <svg className="w-10 h-10 text-indigo-505" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <circle cx="4" cy="5" r="2" />
              <circle cx="20" cy="6" r="2" />
              <circle cx="6" cy="18" r="2" />
              <circle cx="18" cy="19" r="2" />
              <path d="M6 6.5L10 10.5M18 7.5L14 11M7.5 16.5L10.5 13.5M16.5 17.5L13.5 14" strokeDasharray="2 2" />
            </svg>
          }
          heading="Your career map is empty 🌌"
          subtext="Pick a career first — we'll grow the whole universe of related paths around it."
          buttonText="Explore Careers"
          onButtonClick={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto h-full select-none pb-24 transition-colors">
      
      {/* 1. Interactive Mind Map Workspace */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm relative overflow-hidden h-[480px] lg:h-auto min-h-[400px]">
        {/* Header Overlay */}
        <div className="absolute top-4 left-4 z-20 space-y-1">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 font-heading">
            <Network size={16} className="text-brand-primary" /> Career Universe Map
          </h2>
          <p className="text-[10px] text-slate-400">Drag to pan, scroll to zoom. Click nodes to inspect paths.</p>
        </div>

        {/* Control buttons overlay */}
        <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
          <button onClick={() => handleZoom(0.1)} className="px-2 py-1 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded">+</button>
          <button onClick={() => handleZoom(-0.1)} className="px-2 py-1 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded">-</button>
          <button onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }} className="px-2 py-1 text-[10px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded">Reset</button>
        </div>

        {/* Interactive SVG Canvas */}
        <svg 
          className="flex-1 cursor-grab active:cursor-grabbing w-full h-full select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
            {/* Draw Links */}
            {links.map((link, idx) => {
              const srcNode = nodes.find(n => n.id === link.source);
              const tgtNode = nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;
              return (
                <line
                  key={idx}
                  x1={srcNode.x}
                  y1={srcNode.y}
                  x2={tgtNode.x}
                  y2={tgtNode.y}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const isActive = node.id === selectedNodeId;
              const typeColor = node.type === 'core' 
                ? 'fill-indigo-500 stroke-indigo-600' 
                : node.type === 'advanced' 
                  ? 'fill-purple-500 stroke-purple-600' 
                  : 'fill-emerald-500 stroke-emerald-600';
                  
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                >
                  {/* Glowing halo */}
                  {isActive && (
                    <circle r="22" fill="none" stroke="#4F46E5" strokeWidth="2" className="animate-ping" opacity={0.3} />
                  )}
                  {/* Outer circle */}
                  <circle r="14" className={`${typeColor} stroke-2 text-white`} />
                  
                  {/* Inner label */}
                  <text 
                    y="26" 
                    textAnchor="middle" 
                    className={`text-[9px] font-bold select-none ${isActive ? 'fill-indigo-600 dark:fill-indigo-400 font-extrabold' : 'fill-slate-650 dark:fill-slate-350'}`}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 2. Side Panel: Node Details */}
      <aside className="w-full lg:w-80 space-y-4 shrink-0">
        <GlassCard className="p-5 flex flex-col gap-4 border-l-4 border-l-brand-primary h-full justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Career Node details</span>
              <h3 className="text-base font-bold font-heading mt-0.5">{activeNode.name}</h3>
              <span className="text-[9px] bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded-full font-bold inline-block mt-1 capitalize">{activeNode.type} Path</span>
            </div>

            {/* Metrics */}
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Package:</span>
                <span className="font-bold text-slate-850 dark:text-slate-200">{activeNode.salary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Future Demand:</span>
                <span className="font-bold text-emerald-500">{activeNode.demand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Automation Risk:</span>
                <span className="font-bold text-rose-500">{activeNode.aiRisk}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">Key Skills Required:</span>
                <div className="flex flex-wrap gap-1">
                  {activeNode.skills.map(s => (
                    <span key={s} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button 
              onClick={() => navigate('/career-roadmap')}
              className="btn-primary w-full text-center text-xs py-2"
            >
              Analyze Roadmap timeline
            </button>
            <button 
              onClick={() => navigate('/salary-explorer')}
              className="btn-secondary w-full text-center text-xs py-2"
            >
              Compare Salary details
            </button>
          </div>
        </GlassCard>
      </aside>
    </div>
  );
};
