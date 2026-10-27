import React, { useState, useRef } from 'react';
import { Upload, FileText, Plus, Trash2, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { ArchiveProject, ArchiveFile } from '../types/archive';

interface ArchiveIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestProject: (project: ArchiveProject) => void;
}

export const ArchiveIngestionModal: React.FC<ArchiveIngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestProject,
}) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [maintainer, setMaintainer] = useState('');
  const [year, setYear] = useState('2003');
  const [language, setLanguage] = useState('C / Shell');
  const [license, setLicense] = useState('GPL-2.0');
  const [summary, setSummary] = useState('');
  const [files, setFiles] = useState<ArchiveFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [pasteFileName, setPasteFileName] = useState('README.md');
  const [pasteContent, setPasteContent] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFilesChosen = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lineCount = text.split('\n').length;
        const newFile: ArchiveFile = {
          filename: file.name,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          content: text,
          language: file.name.endsWith('.md')
            ? 'markdown'
            : file.name.endsWith('.c') || file.name.endsWith('.h')
            ? 'c'
            : file.name.endsWith('.py')
            ? 'python'
            : 'plaintext',
          lineCount,
        };

        setFiles((prev) => [...prev.filter((f) => f.filename !== file.name), newFile]);
      };
      reader.readAsText(file);
    });
  };

  const handleAddPastedFile = () => {
    if (!pasteContent.trim() || !pasteFileName.trim()) return;
    const newFile: ArchiveFile = {
      filename: pasteFileName.trim(),
      title: pasteFileName.trim().replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      content: pasteContent.trim(),
      language: pasteFileName.endsWith('.md') ? 'markdown' : 'plaintext',
      lineCount: pasteContent.trim().split('\n').length,
    };
    setFiles((prev) => [...prev.filter((f) => f.filename !== newFile.filename), newFile]);
    setPasteContent('');
    setPasteFileName('ARCHITECTURE.txt');
  };

  const handleRemoveFile = (filename: string) => {
    setFiles((prev) => prev.filter((f) => f.filename !== filename));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Detect obsolete dependencies across files
    const allContent = files.map((f) => f.content).join('\n').toLowerCase();
    const detectedDeps: string[] = [];
    if (allContent.includes('md5')) detectedDeps.push('MD5 Checksums');
    if (allContent.includes('select(') || allContent.includes('fd_set')) detectedDeps.push('select(2) Socket Loop');
    if (allContent.includes('python 2') || allContent.includes('urllib')) detectedDeps.push('Python 2 Standard Library');
    if (allContent.includes('strcpy') || allContent.includes('gets')) detectedDeps.push('Unbounded String Manipulation');
    if (detectedDeps.length === 0) detectedDeps.push('Unspecified Legacy Toolchain');

    const totalLines = files.reduce((acc, f) => acc + f.lineCount, 0);

    const newProject: ArchiveProject = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Custom Ingested Open-Source Archive',
      version: '1.0.0-archive',
      year: parseInt(year) || 2003,
      maintainer: maintainer.trim() || 'Anonymous Ingestor',
      status: 'archived',
      lastActive: `Preserved Ingestion (${new Date().toLocaleDateString()})`,
      license: license.trim() || 'Open Source',
      primaryLanguage: language.trim() || 'Mixed',
      summary: summary.trim() || 'A user-ingested software artifact resurrected for examination.',
      tags: ['Custom Archive', language.trim(), 'User Ingested'],
      files: files.length > 0 ? files : [
        {
          filename: 'README.md',
          title: 'Project Overview',
          language: 'markdown',
          lineCount: 12,
          content: `# ${name}\n\n${summary || 'No documentation supplied.'}\n\nPreserved via Archive Afterlife.`,
        },
      ],
      stats: {
        fileCount: files.length > 0 ? files.length : 1,
        totalLines: totalLines > 0 ? totalLines : 12,
        obsoleteDeps: detectedDeps,
        riskScore: detectedDeps.length > 2 ? 'High' : 'Moderate',
        mysteryLevel: 'A freshly exhumed digital relic uploaded directly by the user.',
      },
    };

    onIngestProject(newProject);
    onClose();
  };

  const loadSampleQuickPasting = () => {
    setName('NetPhantasm Micro-Router');
    setSubtitle('1998 Lightweight HTTP Proxy and DNS Filter');
    setMaintainer('K. Sterling / CyberNet Foundation');
    setYear('1998');
    setLanguage('C / Makefile');
    setLicense('MIT');
    setSummary('An early low-latency HTTP proxy daemon intended to circumvent 90s dial-up bottlenecks using raw socket caching.');
    setFiles([
      {
        filename: 'README.txt',
        title: 'Project Overview',
        language: 'plaintext',
        lineCount: 45,
        content: `NetPhantasm Proxy (v0.4a - 1998)
Author: K. Sterling <ksterling@cybernet.org>

A socket proxy daemon written to cache HTTP 1.0 GET requests in memory.
Uses select() loop on port 8080.
Warning: Buffer size fixed at 1024 bytes. Vulnerable to GET buffer overflows.
Compile with: gcc -O proxy.c -o netphantasm
Abandoned when author migrated to Apache module development in 2001.`,
      },
      {
        filename: 'RFC_PROXY.md',
        title: 'Proxy Wire Protocol',
        language: 'markdown',
        lineCount: 30,
        content: `# NetPhantasm Wire Spec
- Listens on TCP 8080
- Resolves DNS using gethostbyname() [OBSOLETE: not thread safe]
- Hashes URLs using custom CRC-32 cache index`,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#12141d] border border-stone-700/80 rounded-xl shadow-2xl p-6 sm:p-8 text-stone-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-400">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl text-stone-100">Exhume & Ingest An Archive</h3>
            <p className="text-xs font-mono text-stone-400">
              Upload text, Markdown, or source files (.md, .txt, .c, .py) to awaken a new ghost
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-stone-400 mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ShadowGate VPN"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded focus:border-amber-500 focus:outline-none text-stone-200"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Subtitle / Descriptor</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Distributed P2P Routing Daemon"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded focus:border-amber-500 focus:outline-none text-stone-200"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">Original Maintainer / Author</label>
              <input
                type="text"
                value={maintainer}
                onChange={(e) => setMaintainer(e.target.value)}
                placeholder="e.g. pseudonymous dev, university lab"
                className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded focus:border-amber-500 focus:outline-none text-stone-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-stone-400 mb-1">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded focus:border-amber-500 focus:outline-none text-stone-200"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Primary Language</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. C, Python 2"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded focus:border-amber-500 focus:outline-none text-stone-200"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-400 mb-1">Historical Summary & Purpose</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What did this project do and under what circumstances was it abandoned?"
              className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded focus:border-amber-500 focus:outline-none text-xs font-sans text-stone-200"
            />
          </div>

          {/* Upload / Drag and Drop Zone */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
              Codex Files & Documentation
            </span>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFilesChosen(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-amber-400 bg-amber-950/20'
                  : 'border-stone-800 hover:border-stone-700 bg-stone-950/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.md,.c,.h,.py,.erl,.json"
                onChange={(e) => handleFilesChosen(e.target.files)}
                className="hidden"
              />
              <Upload className="w-6 h-6 mx-auto text-stone-500 mb-2" />
              <p className="text-xs font-mono text-stone-300">
                Drag & drop files here or <span className="text-amber-400 underline">browse</span>
              </p>
              <p className="text-[11px] font-mono text-stone-500 mt-1">
                Supports README.md, RFCs, specs, and source files (.txt, .md, .c, .h, .py)
              </p>
            </div>

            {/* Uploaded File List */}
            {files.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.filename}
                    className="p-2 rounded bg-stone-950 border border-stone-800 flex items-center justify-between text-xs font-mono text-stone-300"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{file.filename}</span>
                      <span className="text-stone-500">({file.lineCount} lines)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.filename)}
                      className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Paste Alternate */}
          <div className="p-4 rounded bg-stone-950/80 border border-stone-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400">
              <span>Or Paste Raw Markdown / README text:</span>
              <input
                type="text"
                value={pasteFileName}
                onChange={(e) => setPasteFileName(e.target.value)}
                className="px-2 py-0.5 bg-stone-900 border border-stone-700 rounded text-[11px] text-stone-200"
                placeholder="filename.md"
              />
            </div>
            <textarea
              rows={3}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Paste Markdown documentation or code here..."
              className="w-full px-3 py-2 bg-stone-900/60 border border-stone-800 rounded font-mono text-xs text-stone-200 focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddPastedFile}
                disabled={!pasteContent.trim()}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-mono disabled:opacity-40"
              >
                Attach Pasted Document
              </button>
            </div>
          </div>

          {/* Submit & Demo Presets Bar */}
          <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={loadSampleQuickPasting}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 underline"
            >
              Fill Sample Ingestion Preset
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-stone-400 hover:text-stone-200 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-mono text-xs font-semibold rounded transition-colors flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Awaken & Set As Active Archive</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
