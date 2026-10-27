import React, { useState, useEffect } from 'react';
import { SAMPLE_ARCHIVES } from './data/sampleArchives';
import { ArchiveProject, GhostMessage, ResurrectionReport, EngineStatus, EvidenceCitation } from './types/archive';
import { Header } from './components/Header';
import { HauntedVaultHero } from './components/HauntedVaultHero';
import { GhostTerminal } from './components/GhostTerminal';
import { CodexDocumentViewer } from './components/CodexDocumentViewer';
import { ResurrectionReportView } from './components/ResurrectionReportView';
import { ArchiveIngestionModal } from './components/ArchiveIngestionModal';
import { AboutSection } from './components/AboutSection';
import { EngineStatusBadge } from './components/EngineStatusBadge';
import { Sparkles, Terminal, Flame, BookOpen, Compass, Layers } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<ArchiveProject[]>(SAMPLE_ARCHIVES);
  const [selectedProject, setSelectedProject] = useState<ArchiveProject>(SAMPLE_ARCHIVES[0]);
  const [activeTab, setActiveTab] = useState<'vault' | 'summon' | 'codex' | 'resurrection' | 'ingest' | 'about'>('vault');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [engineStatus, setEngineStatus] = useState<EngineStatus | null>(null);
  const [activeCitation, setActiveCitation] = useState<EvidenceCitation | null>(null);

  // Ghost conversation state
  const [messages, setMessages] = useState<GhostMessage[]>([]);
  const [isSummoning, setIsSummoning] = useState(false);

  // Resurrection Report state
  const [report, setReport] = useState<ResurrectionReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Initialize conversation when project changes
  useEffect(() => {
    const initialGreeting: GhostMessage = {
      id: `init-${selectedProject.id}`,
      role: 'ghost',
      content: `[MAINTAINER ECHO: ${selectedProject.maintainer}]\n\n"You have disturbed the dust of ${selectedProject.name} (v${selectedProject.version}).\nLast active on ${selectedProject.lastActive}. The codices remain intact across ${selectedProject.files.length} preserved documents.\n\nAsk of our design philosophy, our protocol flaws, or why we vanished into the dark."`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: 'maintainer_echo',
      engineUsed: engineStatus?.isConfigured ? 'Gemma 2 (Hosted)' : 'Deterministic Archive Oracle (Demo Mode)',
      isDemoMode: !engineStatus?.isConfigured,
      evidenceQuotes: [
        {
          file: selectedProject.files[0]?.filename || 'README.txt',
          section: 'Initial Salutation',
          quote: selectedProject.files[0]?.content.slice(0, 180) || '',
          relevance: 'Opening manifesto preserved in project archives',
        },
      ],
    };
    setMessages([initialGreeting]);
    setReport(null);
  }, [selectedProject]);

  // Fetch engine status on mount
  useEffect(() => {
    fetch('/api/engine/status')
      .then((res) => res.json())
      .then((data: EngineStatus) => setEngineStatus(data))
      .catch((err) => {
        console.warn('Could not fetch server engine status, using fallback demo metadata:', err);
        setEngineStatus({
          mode: 'demo_deterministic',
          modelName: 'Deterministic Archive Oracle',
          provider: 'Demo Knowledge Engine',
          isConfigured: false,
          envKeyPresent: false,
          message: 'Operating in deterministic grounded demo mode.',
          supportedModels: ['gemma-2-9b-it', 'gemma-2-27b-it'],
        });
      });
  }, []);

  // Handle sending question to ghost
  const handleSendMessage = async (
    question: string,
    persona: 'maintainer_echo' | 'system_ghost' | 'code_archaeologist'
  ) => {
    const userMsg: GhostMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSummoning(true);

    try {
      const res = await fetch('/api/archive/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: selectedProject,
          question,
          persona,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const ghostMsg: GhostMessage = await res.json();
      setMessages((prev) => [...prev, ghostMsg]);
    } catch (err) {
      console.error('Failed to summon ghost:', err);
      const fallbackMsg: GhostMessage = {
        id: `err-${Date.now()}`,
        role: 'ghost',
        content: `[GHOST CHANNEL INTERRUPTED]\n\nThe spectral connection was disrupted: ${(err as Error).message}. Operating in grounded fallback mode. Consult the Archive Codex for raw documented evidence.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engineUsed: 'System Diagnostic',
        isDemoMode: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSummoning(false);
    }
  };

  // Handle generating resurrection report
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/archive/resurrect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: selectedProject }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const rep: ResurrectionReport = await res.json();
      setReport(rep);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // When a citation is clicked, navigate to Codex tab and set highlighted citation
  const handleSelectCitation = (citation: EvidenceCitation) => {
    setActiveCitation(citation);
    setActiveTab('codex');
  };

  // Ingest new custom archive
  const handleIngestProject = (newProject: ArchiveProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProject(newProject);
    setActiveTab('summon');
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-[#e2ded4] flex flex-col selection:bg-amber-900/60 selection:text-amber-200">
      {/* Top Bar with 3-Zone Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        engineStatus={engineStatus}
        onOpenIngest={() => setIsIngestModalOpen(true)}
      />

      {/* Relic Selector Bar below Header */}
      <section className="bg-[#0f1118] border-b border-stone-800/80 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-stone-500 uppercase tracking-wider text-[11px] shrink-0 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Current Relic:</span>
            </span>

            <div className="flex items-center gap-1.5">
              {projects.map((p) => {
                const isActive = selectedProject.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProject(p);
                      setActiveCitation(null);
                    }}
                    className={`px-3 py-1 rounded transition-colors whitespace-nowrap shrink-0 text-xs ${
                      isActive
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-700/60 font-semibold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                    }`}
                  >
                    {p.name} ({p.year})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <EngineStatusBadge status={engineStatus} />
          </div>
        </div>
      </section>

      {/* Main Reading / Interactive Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'vault' && (
          <HauntedVaultHero
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={(p) => setSelectedProject(p)}
            onSummonGhost={(p) => {
              setSelectedProject(p);
              setActiveTab('summon');
            }}
            onViewCodex={(p) => {
              setSelectedProject(p);
              setActiveCitation(null);
              setActiveTab('codex');
            }}
            onOpenReport={(p) => {
              setSelectedProject(p);
              setActiveTab('resurrection');
              if (!report) handleGenerateReport();
            }}
            onOpenIngest={() => setIsIngestModalOpen(true)}
          />
        )}

        {activeTab === 'summon' && (
          <GhostTerminal
            project={selectedProject}
            engineStatus={engineStatus}
            messages={messages}
            isSummoning={isSummoning}
            onSendMessage={handleSendMessage}
            onSelectCitation={handleSelectCitation}
            onResetConversation={() => {
              const resetGreeting: GhostMessage = {
                id: `reset-${Date.now()}`,
                role: 'ghost',
                content: `[MAINTAINER ECHO: ${selectedProject.maintainer}]\n\n"The shadow connection has been cleared. The codex of ${selectedProject.name} awaits your new inquiry."`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                persona: 'maintainer_echo',
                engineUsed: engineStatus?.isConfigured ? 'Gemma 2' : 'Deterministic Oracle (Demo)',
                isDemoMode: !engineStatus?.isConfigured,
              };
              setMessages([resetGreeting]);
            }}
          />
        )}

        {activeTab === 'codex' && (
          <CodexDocumentViewer
            project={selectedProject}
            activeCitation={activeCitation}
            onClearCitation={() => setActiveCitation(null)}
          />
        )}

        {activeTab === 'resurrection' && (
          <ResurrectionReportView
            project={selectedProject}
            report={report}
            isLoading={isGeneratingReport}
            onGenerateReport={handleGenerateReport}
            onSelectCitation={handleSelectCitation}
            onSummonGhost={() => setActiveTab('summon')}
          />
        )}

        {activeTab === 'about' && (
          <AboutSection
            engineStatus={engineStatus}
            onOpenIngest={() => setIsIngestModalOpen(true)}
          />
        )}
      </main>

      {/* Ingestion Modal */}
      <ArchiveIngestionModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onIngestProject={handleIngestProject}
      />

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-stone-800/80 bg-[#0a0b10] px-6 py-6 text-xs font-mono text-stone-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-stone-300 font-medium">Archive Afterlife</span>
            <span aria-hidden="true">·</span>
            <span>The Ghost in the Machine</span>
            <span aria-hidden="true">·</span>
            <span>Hacktoberfest 2026 Open-Source AI Challenge</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-stone-200 transition-colors"
            >
              Open-Weight AI Principles
            </button>
            <span aria-hidden="true">·</span>
            <span>Gemma 2 Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
