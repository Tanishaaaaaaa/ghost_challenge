import React from 'react';
import { Skull, Sparkles, Terminal, FileText, Cpu, BookOpen } from 'lucide-react';
import { EngineStatus } from '../types/archive';

interface HeaderProps {
  activeTab: 'vault' | 'summon' | 'codex' | 'resurrection' | 'ingest' | 'about';
  setActiveTab: (tab: 'vault' | 'summon' | 'codex' | 'resurrection' | 'ingest' | 'about') => void;
  engineStatus: EngineStatus | null;
  onOpenIngest: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  engineStatus,
  onOpenIngest,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/90 backdrop-blur-md border-b border-stone-800/80 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('vault')}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-8 h-8 rounded bg-stone-900 border border-amber-900/40 flex items-center justify-center text-amber-400 group-hover:border-amber-500/60 transition-colors shadow-inner">
            <Skull className="w-4 h-4 text-amber-400/90" />
          </div>
          <div>
            <span className="font-display text-lg tracking-wider font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">
              Archive Afterlife
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-mono text-stone-400">
          <button
            onClick={() => setActiveTab('vault')}
            className={`transition-colors hover:text-amber-300 pb-0.5 whitespace-nowrap shrink-0 ${
              activeTab === 'vault' ? 'text-amber-400 border-b border-amber-400 font-medium' : ''
            }`}
          >
            Haunted Vault
          </button>
          <button
            onClick={() => setActiveTab('summon')}
            className={`transition-colors hover:text-emerald-300 pb-0.5 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'summon' ? 'text-emerald-400 border-b border-emerald-400 font-medium' : ''
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Summon Ghost
          </button>
          <button
            onClick={() => setActiveTab('codex')}
            className={`transition-colors hover:text-amber-300 pb-0.5 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'codex' ? 'text-amber-400 border-b border-amber-400 font-medium' : ''
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Archive Codex
          </button>
          <button
            onClick={() => setActiveTab('resurrection')}
            className={`transition-colors hover:text-amber-300 pb-0.5 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'resurrection' ? 'text-amber-400 border-b border-amber-400 font-medium' : ''
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Resurrection Report
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors hover:text-stone-200 pb-0.5 whitespace-nowrap shrink-0 ${
              activeTab === 'about' ? 'text-stone-100 border-b border-stone-400 font-medium' : ''
            }`}
          >
            Open-Weight AI
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenIngest}
            className="px-3.5 py-1.5 text-xs font-mono tracking-wide text-amber-200 bg-amber-950/40 border border-amber-700/50 hover:bg-amber-900/50 hover:border-amber-500 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ingest Archive</span>
          </button>
        </div>
      </div>
    </header>
  );
};
