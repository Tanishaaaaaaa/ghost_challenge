import React from 'react';
import { Terminal, Flame, BookOpen, FileText, ArrowRight, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { ArchiveProject } from '../types/archive';

interface HauntedVaultHeroProps {
  projects: ArchiveProject[];
  selectedProject: ArchiveProject;
  onSelectProject: (project: ArchiveProject) => void;
  onSummonGhost: (project: ArchiveProject) => void;
  onViewCodex: (project: ArchiveProject) => void;
  onOpenReport: (project: ArchiveProject) => void;
  onOpenIngest: () => void;
}

export const HauntedVaultHero: React.FC<HauntedVaultHeroProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onSummonGhost,
  onViewCodex,
  onOpenReport,
  onOpenIngest,
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Editorial Marquee Hero */}
      <section className="relative overflow-hidden rounded-xl border border-stone-800/80 bg-[#10121a]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px]">
          {/* Left Column: Haunting Headline & Editorial Rationale */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-amber-500/90 mb-4">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>The Digital Crypt · Hacktoberfest 2026</span>
                <span aria-hidden="true">/</span>
                <span>Open-Source AI Challenge</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-100 leading-[1.15] max-w-xl text-balance">
                Some code refuses to be forgotten.
              </h1>

              <p className="mt-5 text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl font-sans">
                Every year, thousands of revolutionary open-source projects sink beneath the digital waves—abandoned to bit-rot, deprecated syscalls, and shifting commercial interests.
                Step inside the vault to inspect their original codices, question their maintainer ghosts via open-weight intelligence, and forge modern resurrection blueprints.
              </p>
            </div>

            {/* Quick Actions Strip */}
            <div className="pt-8 border-t border-stone-800/80 mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onSummonGhost(selectedProject)}
                className="px-5 py-2.5 text-xs font-mono tracking-wide text-black font-semibold bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-2 shadow-lg shadow-amber-950/40"
              >
                <Terminal className="w-4 h-4 text-stone-900" />
                <span>Summon Ghost of {selectedProject.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenIngest}
                className="px-4 py-2.5 text-xs font-mono tracking-wide text-stone-200 bg-stone-900/80 hover:bg-stone-800 border border-stone-700 rounded transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ingest Your Own Archive</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Archival Image Asset with Scrim */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <img
              src="/src/assets/images/archive_hero_atmosphere_1793115833634.jpg"
              alt="Haunting archival vault at midnight with glowing vintage CRT terminals and candlelight"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Measured Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#10121a] via-[#10121a]/60 to-transparent pointer-events-none" />

            {/* Active Relic Badge Overlay */}
            <div className="absolute bottom-4 right-4 bg-stone-950/90 border border-stone-700/80 rounded p-3 text-xs font-mono backdrop-blur-sm max-w-xs shadow-xl">
              <div className="text-amber-400/90 flex items-center gap-1.5 font-medium mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Active Vault Relic</span>
              </div>
              <p className="text-stone-300 font-sans line-clamp-2 text-[11px]">
                {selectedProject.name} ({selectedProject.year}) · Preserved by {selectedProject.maintainer}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preservation Codex Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-stone-100">Preserved Software Tombs</h2>
            <p className="text-xs font-mono text-stone-400 mt-1">
              Select an abandoned relic to awaken its documentation corpus and summon its ghost
            </p>
          </div>
          <div className="text-xs font-mono text-stone-500">
            <span>{projects.length} Relics in Crypt</span>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const isSelected = selectedProject.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className={`cursor-pointer rounded-lg border transition-all duration-200 p-6 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#151824] border-amber-500/70 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/30'
                    : 'bg-[#11131b] border-stone-800 hover:border-stone-700 hover:bg-[#141620]'
                }`}
              >
                <div>
                  {/* Clean unboxed metadata with separators (Anti-Pill Rule) */}
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-400 mb-3">
                    <span className="text-amber-400/90 font-medium">{proj.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{proj.primaryLanguage}</span>
                    <span aria-hidden="true">·</span>
                    <span>{proj.stats.fileCount} Documents</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-rose-400/90">{proj.stats.riskScore} Risk</span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl text-stone-100 group-hover:text-amber-300">
                        {proj.name}
                      </h3>
                      <p className="text-xs font-mono text-amber-500/80 mt-0.5">
                        v{proj.version} · {proj.subtitle}
                      </p>
                    </div>

                    {proj.image && (
                      <div className="w-16 h-12 rounded overflow-hidden border border-stone-800 shrink-0">
                        <img
                          src={proj.image}
                          alt={proj.name}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-stone-300 font-sans mt-3 line-clamp-3 leading-relaxed">
                    {proj.summary}
                  </p>

                  {/* Mystery / Last transmission record */}
                  <div className="mt-4 p-2.5 rounded bg-stone-950/60 border border-stone-800/80 text-[11px] font-mono text-stone-400 flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      <strong className="text-stone-300">Crypt Lore:</strong> {proj.stats.mysteryLevel}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-5 border-t border-stone-800/60 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-stone-400">
                    <span>{proj.maintainer}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCodex(proj);
                      }}
                      className="px-2.5 py-1 text-xs font-mono text-stone-300 hover:text-stone-100 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3 h-3 text-stone-400" />
                      <span>Inspect Codex</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSummonGhost(proj);
                      }}
                      className="px-3 py-1 text-xs font-mono text-amber-300 hover:text-amber-200 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-700/60 rounded transition-colors flex items-center gap-1.5"
                    >
                      <Terminal className="w-3 h-3 text-amber-400" />
                      <span>Summon</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
