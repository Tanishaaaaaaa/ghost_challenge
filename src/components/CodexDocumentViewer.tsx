import React, { useState } from 'react';
import { BookOpen, FileCode, Copy, Check, AlertTriangle, Eye } from 'lucide-react';
import { ArchiveProject, EvidenceCitation } from '../types/archive';

interface CodexDocumentViewerProps {
  project: ArchiveProject;
  activeCitation?: EvidenceCitation | null;
  onClearCitation?: () => void;
}

export const CodexDocumentViewer: React.FC<CodexDocumentViewerProps> = ({
  project,
  activeCitation,
  onClearCitation,
}) => {
  const initialIndex = activeCitation
    ? project.files.findIndex((f) => f.filename === activeCitation.file)
    : 0;

  const [activeFileIndex, setActiveFileIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [copied, setCopied] = useState(false);

  const currentFile = project.files[activeFileIndex] || project.files[0];

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = currentFile ? currentFile.content.split('\n') : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500/90 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Preserved Codices & Engineering Blueprints</span>
          </div>
          <h2 className="font-display text-2xl text-stone-100">
            {project.name} (Accession #{project.id})
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-stone-400">
          <span>{project.files.length} Files</span>
          <span aria-hidden="true">·</span>
          <span>{project.stats.totalLines} Total Lines</span>
          <span aria-hidden="true">·</span>
          <span>License: {project.license}</span>
        </div>
      </div>

      {activeCitation && (
        <div className="p-3.5 rounded bg-amber-950/40 border border-amber-600/50 flex items-center justify-between gap-4 text-xs font-mono text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>
              <strong>Highlighted Citation:</strong> &ldquo;{activeCitation.quote.slice(0, 100)}...&rdquo; ({activeCitation.file})
            </span>
          </div>
          {onClearCitation && (
            <button
              onClick={onClearCitation}
              className="text-amber-400 hover:text-amber-200 underline text-xs"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 rounded bg-[#11131c] border border-stone-800 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block px-1">
              Archived Documents ({project.files.length})
            </span>

            <div className="space-y-1">
              {project.files.map((file, idx) => {
                const isSelected = activeFileIndex === idx;
                const isCited = activeCitation?.file === file.filename;

                return (
                  <button
                    key={file.filename}
                    onClick={() => setActiveFileIndex(idx)}
                    className={`w-full text-left p-2.5 rounded transition-colors text-xs font-mono flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-700/60 font-medium'
                        : isCited
                        ? 'bg-stone-900 text-amber-400 border border-amber-900/60'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">{file.filename}</span>
                    </div>

                    <span className="text-[10px] text-stone-500 shrink-0">
                      {file.lineCount}L
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded bg-[#11131c] border border-stone-800 text-xs font-mono space-y-2.5">
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Documented Risks</span>
            </div>
            <p className="text-stone-400 font-sans text-xs">
              Extracted liabilities recorded in this archive&apos;s codebase:
            </p>
            <ul className="space-y-1.5 text-stone-300">
              {project.stats.obsoleteDeps.map((dep, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px]">
                  <span className="text-rose-500 shrink-0 mt-0.5">•</span>
                  <span>{dep}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8 rounded-lg border border-stone-800 bg-[#0d0f16] flex flex-col overflow-hidden shadow-xl">
          <div className="flex items-center justify-between gap-4 p-3.5 bg-[#12141d] border-b border-stone-800 text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-stone-200">{currentFile?.filename}</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400">{currentFile?.title}</span>
            </div>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/60 transition-colors flex items-center gap-1.5 text-xs"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-stone-400" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto font-mono text-xs leading-relaxed text-stone-300">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isHighlighted =
                    activeCitation &&
                    currentFile?.filename === activeCitation.file &&
                    activeCitation.quote &&
                    line.includes(activeCitation.quote.slice(0, 30));

                  return (
                    <tr
                      key={idx}
                      className={
                        isHighlighted
                          ? 'bg-amber-950/50 text-amber-200 transition-colors'
                          : 'hover:bg-stone-900/40 transition-colors'
                      }
                    >
                      <td className="pr-4 py-0.5 text-stone-600 select-none text-right w-10 shrink-0 border-r border-stone-800/80 font-mono text-[11px]">
                        {lineNum}
                      </td>
                      <td className="pl-4 py-0.5 whitespace-pre font-mono text-xs text-stone-200">
                        {line || ' '}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
