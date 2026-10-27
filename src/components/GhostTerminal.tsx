import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Sparkles, AlertCircle, Quote, Eye, Flame, RotateCcw } from 'lucide-react';
import { ArchiveProject, GhostMessage, EvidenceCitation, EngineStatus } from '../types/archive';

interface GhostTerminalProps {
  project: ArchiveProject;
  engineStatus: EngineStatus | null;
  messages: GhostMessage[];
  isSummoning: boolean;
  onSendMessage: (question: string, persona: 'maintainer_echo' | 'system_ghost' | 'code_archaeologist') => void;
  onSelectCitation: (citation: EvidenceCitation) => void;
  onResetConversation: () => void;
}

export const GhostTerminal: React.FC<GhostTerminalProps> = ({
  project,
  engineStatus,
  messages,
  isSummoning,
  onSendMessage,
  onSelectCitation,
  onResetConversation,
}) => {
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<'maintainer_echo' | 'system_ghost' | 'code_archaeologist'>('maintainer_echo');
  const [enableScanlines] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSummoning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSummoning) return;
    const q = input.trim();
    setInput('');
    onSendMessage(q, persona);
  };

  const suggestedQuestions = [
    {
      label: 'Core Philosophy',
      query: `What was the original design philosophy and motivation behind ${project.name}?`,
    },
    {
      label: 'Security & Flaws',
      query: `What security vulnerabilities, buffer flaws, or cryptographic liabilities exist in this codebase?`,
    },
    {
      label: 'Obsolete Tech',
      query: `Which obsolete protocols and dependencies prevent ${project.name} from compiling today?`,
    },
    {
      label: 'Maintainer Vanishing',
      query: `Who was ${project.maintainer} and why did development cease on ${project.lastActive}?`,
    },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Terminal Titlebar & Ambient Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-t-lg bg-[#11131c] border-t border-x border-stone-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-stone-700/80 border border-stone-600 inline-block" />
            <span className="w-3 h-3 rounded-full bg-stone-700/80 border border-stone-600 inline-block" />
            <span className="w-3 h-3 rounded-full bg-stone-700/80 border border-stone-600 inline-block" />
          </div>

          <div className="font-mono text-xs text-stone-300 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">{project.name}</span>
            <span className="text-stone-500">·</span>
            <span className="text-stone-400">Terminal v{project.version}</span>
            <span className="text-stone-500">·</span>
            <span className="text-amber-400/80">{project.primaryLanguage}</span>
          </div>
        </div>

        {/* Persona Switcher & Toggles */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center bg-stone-900 rounded p-0.5 border border-stone-800">
            <button
              onClick={() => setPersona('maintainer_echo')}
              className={`px-2.5 py-1 rounded transition-colors ${
                persona === 'maintainer_echo'
                  ? 'bg-amber-950/70 text-amber-300 font-medium border border-amber-800/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Maintainer Echo
            </button>
            <button
              onClick={() => setPersona('system_ghost')}
              className={`px-2.5 py-1 rounded transition-colors ${
                persona === 'system_ghost'
                  ? 'bg-emerald-950/70 text-emerald-300 font-medium border border-emerald-800/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              System Daemon
            </button>
            <button
              onClick={() => setPersona('code_archaeologist')}
              className={`px-2.5 py-1 rounded transition-colors ${
                persona === 'code_archaeologist'
                  ? 'bg-stone-800 text-stone-200 font-medium border border-stone-700/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Archaeologist
            </button>
          </div>

          {/* Reset Dialogue Button */}
          <button
            onClick={onResetConversation}
            className="p-1.5 rounded bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700 transition-colors"
            title="Reset conversation with this ghost"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Terminal Screen */}
      <div
        className={`relative rounded-b-lg border-b border-x border-stone-800 bg-[#0c0e14] min-h-[520px] max-h-[660px] flex flex-col justify-between overflow-hidden shadow-2xl ${
          enableScanlines ? 'scanlines-overlay' : ''
        }`}
      >
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs sm:text-sm">
          {/* Introductory Ghost Inscription */}
          <div className="p-4 rounded bg-stone-950/70 border border-stone-800/80 text-stone-400 text-xs leading-relaxed space-y-2">
            <div className="flex items-center justify-between text-stone-300 border-b border-stone-800/80 pb-2">
              <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
                <Flame className="w-3.5 h-3.5" />
                <span>Archive Spirit Summoned: {project.name}</span>
              </span>
              <span className="text-[11px] text-stone-500">
                Grounding Source: {project.files.length} Preserved Codices ({project.stats.totalLines} lines)
              </span>
            </div>
            <p className="text-stone-300 font-sans text-xs">
              This terminal communicates directly with the spirit of {project.name}. Responses are strictly grounded in the preserved files ({project.files.map((f) => f.filename).join(', ')}).
              The ghost will directly quote evidence and candidly notify you if an answer was lost to history.
            </p>
          </div>

          {/* Message List */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col space-y-2 ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                {/* Role / Persona Banner */}
                <div className="flex items-center gap-2 text-[11px] text-stone-500 px-1">
                  <span>{isUser ? 'Inquisitor (You)' : msg.persona || 'Archive Spirit'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{msg.timestamp}</span>
                  {!isUser && msg.engineUsed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-stone-400">{msg.engineUsed}</span>
                    </>
                  )}
                </div>

                {/* Message Body */}
                <div
                  className={`p-4 rounded max-w-3xl leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-amber-950/30 text-amber-200 border border-amber-800/50'
                      : 'bg-[#12141d] text-emerald-300 border border-emerald-900/40 shadow-inner'
                  }`}
                >
                  <div className={!isUser ? 'phosphor-text' : ''}>{msg.content}</div>

                  {/* Quoted Evidence Block */}
                  {msg.evidenceQuotes && msg.evidenceQuotes.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-emerald-950/60 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                        <Quote className="w-3 h-3 text-amber-400" />
                        <span>Documented Codex Evidence</span>
                      </div>
                      <div className="space-y-1.5">
                        {msg.evidenceQuotes.map((cit, idx) => (
                          <div
                            key={idx}
                            onClick={() => onSelectCitation(cit)}
                            className="cursor-pointer p-2 rounded bg-stone-950/80 hover:bg-stone-900 border border-stone-800/80 hover:border-amber-600/50 transition-colors text-xs text-stone-300 flex items-start justify-between gap-3 group"
                          >
                            <div className="space-y-1">
                              <div className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5">
                                <span className="font-semibold underline underline-offset-2">{cit.file}</span>
                                {cit.section && <span className="text-stone-500">({cit.section})</span>}
                              </div>
                              <p className="font-mono text-[11px] text-stone-400 line-clamp-2 italic">
                                &ldquo;{cit.quote}&rdquo;
                              </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-1 text-[11px] text-stone-500 group-hover:text-amber-300 transition-colors mt-0.5">
                              <Eye className="w-3 h-3" />
                              <span>Inspect</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Info Warning */}
                  {msg.missingInfo && msg.missingInfo.length > 0 && (
                    <div className="mt-3 p-2.5 rounded bg-amber-950/30 border border-amber-900/40 text-xs text-amber-300/90 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-300">[UNRECORDED IN SUPPLIED ARCHIVE]: </span>
                        <span>{msg.missingInfo.join(' ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Summoning Loading State */}
          {isSummoning && (
            <div className="flex items-center gap-3 text-xs text-emerald-400/90 p-4 rounded bg-[#12141d] border border-emerald-900/40 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Summoning ghost across the archived codex... channeling memory buffers...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Suggested Inquiries */}
        <div className="p-4 bg-[#0f1118] border-t border-stone-800 space-y-3">
          {/* Quick Prompts Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            <span className="text-stone-500 text-[11px] shrink-0">Inquire:</span>
            {suggestedQuestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendMessage(s.query, persona)}
                disabled={isSummoning}
                className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 hover:border-stone-700 transition-colors whitespace-nowrap shrink-0 text-xs"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask the ghost of ${project.name} (e.g. "Why did socket select() crash?", "Explain the Euclidean DHT")`}
                disabled={isSummoning}
                className="w-full px-4 py-2.5 text-xs sm:text-sm font-mono text-emerald-300 placeholder-stone-600 bg-stone-950 border border-stone-800 focus:border-emerald-600/70 focus:outline-none rounded transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSummoning || !input.trim()}
              className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded text-xs font-mono font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shrink-0 shadow-sm"
            >
              <span>Transmit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
