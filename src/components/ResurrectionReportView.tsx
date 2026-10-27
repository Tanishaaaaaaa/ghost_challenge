import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Check, Printer, AlertTriangle, ShieldCheck, Quote, Eye, Compass, History, Terminal } from 'lucide-react';
import { ResurrectionReport, ArchiveProject, EvidenceCitation } from '../types/archive';

interface ResurrectionReportViewProps {
  project: ArchiveProject;
  report: ResurrectionReport | null;
  isLoading: boolean;
  onGenerateReport: () => void;
  onSelectCitation: (citation: EvidenceCitation) => void;
  onSummonGhost: () => void;
}

export const ResurrectionReportView: React.FC<ResurrectionReportViewProps> = ({
  project,
  report,
  isLoading,
  onGenerateReport,
  onSelectCitation,
  onSummonGhost,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    if (!report) return;
    const md = `# RESURRECTION REPORT: ${report.projectName} (v${report.version})
Generated: ${report.generatedAt}
Engine: ${report.engineUsed} (${report.isDemoMode ? 'Demo Mode' : 'Hosted Gemma'})

## 1. DOCUMENTED FACTS & ORIGINAL PURPOSE [DOCUMENTED FACT]
- Purpose: ${report.documentedFacts.originalPurpose}
- Historical Context: ${report.documentedFacts.historicalContext}
- Author Intent: ${report.documentedFacts.authorIntent}

## 2. ARCHITECTURAL ANATOMY [DOCUMENTED FACT]
- Paradigm: ${report.architecturalAnatomy.paradigm}
- Core Primitives: ${report.architecturalAnatomy.corePrimitives.join(', ')}

## 3. OBSOLETE RISK AUDIT [DOCUMENTED FACT]
${report.obsoleteRiskAudit
  .map((item) => `- ${item.obsoleteTech} -> Replace with: ${item.modernAlternative} (${item.urgency}): ${item.rationale}`)
  .join('\n')}

## 4. MODERNIZATION BLUEPRINT [ARCHAEOLOGICAL HYPOTHESIS]
- Target Stack: ${report.modernizationPlan.targetLanguages.join(', ')}
- Frameworks: ${report.modernizationPlan.suggestedFrameworks.join(', ')}
- Strategy: ${report.modernizationPlan.reimplementationStrategy}
${report.modernizationPlan.milestones
  .map((m) => `### ${m.phase}\n${m.description}\nExpected Artifact: ${m.expectedArtifact}`)
  .join('\n\n')}

## 5. UNANSWERED HISTORICAL QUESTIONS [LOST TO TIME]
${report.unansweredQuestions.map((q) => `- ${q}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500/90 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Digital Resurrection Dossier · Architectural Reconstruction</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-stone-100">
            Resurrection Blueprint: {project.name}
          </h2>
          <p className="text-xs font-mono text-stone-400 mt-1">
            Modernization strategy for {project.primaryLanguage} archive (Last recorded active: {project.lastActive})
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onGenerateReport}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded text-xs font-mono text-stone-900 bg-amber-400 hover:bg-amber-300 font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{report ? 'Regenerate Dossier' : 'Synthesize Report'}</span>
          </button>

          {report && (
            <>
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 rounded text-xs font-mono text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                <span>{copied ? 'Copied' : 'Copy MD'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded text-xs font-mono text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-700 transition-colors flex items-center gap-1.5"
                title="Print or export as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-stone-400" />
                <span>Print</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 text-center rounded-lg border border-stone-800 bg-[#10121a] space-y-4 animate-pulse">
          <div className="w-10 h-10 mx-auto rounded-full bg-amber-950/60 border border-amber-600/50 flex items-center justify-center text-amber-400 animate-spin">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg text-stone-200">Decompiling Historical Specifications...</h3>
          <p className="text-xs font-mono text-stone-400 max-w-md mx-auto">
            Extracting documented axioms, classifying obsolete wire protocols, and synthesizing modern memory-safe architecture...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!report && !isLoading && (
        <div className="p-12 text-center rounded-lg border border-stone-800 bg-[#10121a] space-y-4">
          <FileText className="w-10 h-10 mx-auto text-stone-600" />
          <h3 className="font-display text-xl text-stone-200">No Resurrection Dossier Synthesized Yet</h3>
          <p className="text-xs font-mono text-stone-400 max-w-md mx-auto">
            Click &ldquo;Synthesize Report&rdquo; to analyze the {project.files.length} codices of {project.name} and generate a structured modernization roadmap.
          </p>
          <button
            onClick={onGenerateReport}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-mono text-xs font-semibold rounded transition-colors inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Resurrection Report Now</span>
          </button>
        </div>
      )}

      {/* Report Content */}
      {report && !isLoading && (
        <div className="space-y-8 animate-fade-in">
          {/* Metadata Attribution Bar */}
          <div className="p-3.5 rounded bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-400">
            <div className="flex items-center gap-2">
              <span className="text-stone-500">Engine:</span>
              <span className="text-stone-200 font-semibold">{report.engineUsed}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Synthesized: {new Date(report.generatedAt).toLocaleDateString()}</span>
              <span aria-hidden="true">·</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] ${
                  report.isDemoMode
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                    : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                }`}
              >
                {report.isDemoMode ? 'Deterministic Knowledge Base' : 'Neural Gemma Inference'}
              </span>
            </div>
          </div>

          {/* Section 1: Original Purpose & Historical Context */}
          <section className="p-6 rounded-lg border border-stone-800 bg-[#11131c] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-display text-lg text-stone-100 flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <span>1. Original Purpose & Historical Context</span>
              </h3>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-medium">
                [DOCUMENTED FACT]
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              <p>
                <strong className="text-stone-100 font-mono text-xs">Documented Purpose: </strong>
                {report.documentedFacts.originalPurpose}
              </p>
              <p>
                <strong className="text-stone-100 font-mono text-xs">Historical Era: </strong>
                {report.documentedFacts.historicalContext}
              </p>
              <p>
                <strong className="text-stone-100 font-mono text-xs">Author Intent: </strong>
                {report.documentedFacts.authorIntent}
              </p>
            </div>

            {/* Supporting Evidence Citations */}
            {report.documentedFacts.evidenceCitations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-800/80 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400/90 block">
                  Preserved Codex References
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {report.documentedFacts.evidenceCitations.map((cit, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectCitation(cit)}
                      className="cursor-pointer p-2.5 rounded bg-stone-950 hover:bg-stone-900 border border-stone-800/80 hover:border-amber-600/50 transition-colors text-xs text-stone-300 flex items-start justify-between gap-2 group"
                    >
                      <div className="space-y-1">
                        <div className="font-mono text-[11px] text-amber-400 font-medium">
                          {cit.file} {cit.lineRange && <span className="text-stone-500">({cit.lineRange})</span>}
                        </div>
                        <p className="font-mono text-[11px] text-stone-400 line-clamp-2 italic">
                          &ldquo;{cit.quote}&rdquo;
                        </p>
                      </div>
                      <Eye className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-300 shrink-0 mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Architectural Anatomy */}
          <section className="p-6 rounded-lg border border-stone-800 bg-[#11131c] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-display text-lg text-stone-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>2. Architectural Anatomy & Invariants</span>
              </h3>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-medium">
                [DOCUMENTED FACT]
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded bg-stone-950 border border-stone-800 font-mono text-xs text-amber-300">
                <span className="text-stone-400">Core Paradigm: </span>
                {report.architecturalAnatomy.paradigm}
              </div>

              <div>
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                  Primary Primitives
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-stone-300">
                  {report.architecturalAnatomy.corePrimitives.map((prim, idx) => (
                    <li key={idx} className="p-2 rounded bg-stone-950/60 border border-stone-800/80 flex items-center gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{prim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-900/40 text-xs space-y-2">
                  <span className="font-mono text-emerald-400 font-semibold block uppercase tracking-wider">
                    Historic Strengths
                  </span>
                  <ul className="space-y-1 text-stone-300 font-sans">
                    {report.architecturalAnatomy.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded bg-rose-950/20 border border-rose-900/40 text-xs space-y-2">
                  <span className="font-mono text-rose-400 font-semibold block uppercase tracking-wider">
                    Identified Architectural Liabilities
                  </span>
                  <ul className="space-y-1 text-stone-300 font-sans">
                    {report.architecturalAnatomy.structuralFlaws.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Obsolete Risk Audit */}
          <section className="p-6 rounded-lg border border-stone-800 bg-[#11131c] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-display text-lg text-stone-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>3. Obsolete Dependency & Risk Audit</span>
              </h3>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-medium">
                [DOCUMENTED LIABILITIES]
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase text-[11px]">
                    <th className="py-2.5 px-3">Obsolete Technology</th>
                    <th className="py-2.5 px-3">Modern Alternative</th>
                    <th className="py-2.5 px-3">Urgency</th>
                    <th className="py-2.5 px-3">Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {report.obsoleteRiskAudit.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-900/40">
                      <td className="py-3 px-3 font-semibold text-rose-300 whitespace-nowrap">
                        {item.obsoleteTech}
                      </td>
                      <td className="py-3 px-3 text-emerald-300 font-semibold whitespace-nowrap">
                        {item.modernAlternative}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.urgency === 'Immediate'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-400 font-sans text-xs">
                        {item.rationale}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Modernization Blueprint (AI Hypothesis) */}
          <section className="p-6 rounded-lg border border-amber-900/40 bg-[#121420] space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-display text-lg text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>4. Modernization Blueprint & Rewrite Strategy</span>
              </h3>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-medium">
                [ARCHAEOLOGICAL HYPOTHESIS]
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block mb-1">Recommended Target Languages:</span>
                  <span className="text-stone-100 font-semibold">{report.modernizationPlan.targetLanguages.join(' · ')}</span>
                </div>
                <div className="p-3 rounded bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block mb-1">Modern Ecosystem Frameworks:</span>
                  <span className="text-stone-100 font-semibold">{report.modernizationPlan.suggestedFrameworks.join(' · ')}</span>
                </div>
              </div>

              <div className="p-4 rounded bg-stone-950/80 border border-stone-800 text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                <strong className="text-amber-300 font-mono text-xs block mb-1.5">Architectural Re-Implementation Strategy:</strong>
                {report.modernizationPlan.reimplementationStrategy}
              </div>

              {/* Milestones */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400/90 block">
                  Phased Resurrection Roadmap
                </span>
                <div className="space-y-2">
                  {report.modernizationPlan.milestones.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded bg-stone-950 border border-stone-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-mono text-amber-300 font-semibold">
                        <span>{m.phase}</span>
                        <span className="text-stone-500 text-[11px]">Milestone {idx + 1}</span>
                      </div>
                      <p className="text-stone-300 font-sans text-xs">{m.description}</p>
                      <div className="text-[11px] font-mono text-stone-400 pt-1">
                        <strong className="text-emerald-400">Target Artifact: </strong>
                        <span>{m.expectedArtifact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Unanswered Questions & Lost Artifacts */}
          <section className="p-6 rounded-lg border border-stone-800 bg-[#11131c] space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-display text-lg text-stone-100 flex items-center gap-2">
                <History className="w-4 h-4 text-stone-400" />
                <span>5. Unanswered Questions & Lost Artifacts</span>
              </h3>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-medium">
                [DIGITAL DARK AGES]
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-stone-400 font-sans">
                True software archaeology must honestly acknowledge where the historical record terminates:
              </p>

              <div className="space-y-2">
                {report.unansweredQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 rounded bg-stone-950/70 border border-stone-800/80 text-xs font-mono text-stone-300 flex items-start gap-2.5">
                    <span className="text-amber-500 font-bold">?</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>

              {report.lostArtifacts && report.lostArtifacts.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-800 text-xs font-mono">
                  <span className="text-rose-400/90 font-semibold uppercase block mb-1.5">
                    Known Lost Relics / Vanished Archives:
                  </span>
                  <ul className="space-y-1 text-stone-400">
                    {report.lostArtifacts.map((art, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-rose-500">✕</span>
                        <span>{art}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Bottom Prompt to Chat with Ghost */}
          <div className="p-5 rounded-lg border border-stone-800 bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-display text-base text-stone-100">Have questions about this blueprint?</h4>
              <p className="text-xs font-mono text-stone-400 mt-0.5">
                Channel the ghost of {project.name} to question any of these findings.
              </p>
            </div>
            <button
              onClick={onSummonGhost}
              className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-mono text-xs font-medium rounded transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Summon Ghost Discussion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
