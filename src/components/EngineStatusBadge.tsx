import React, { useState } from 'react';
import { Cpu, Info, CheckCircle2, AlertCircle, Key, ExternalLink, X } from 'lucide-react';
import { EngineStatus } from '../types/archive';

interface EngineStatusBadgeProps {
  status: EngineStatus | null;
}

export const EngineStatusBadge: React.FC<EngineStatusBadgeProps> = ({ status }) => {
  const [showModal, setShowModal] = useState(false);

  const isConfigured = status?.isConfigured ?? false;
  const modelName = status?.modelName ?? 'Deterministic Archive Oracle';

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono transition-colors border ${
            isConfigured
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/50'
              : 'bg-stone-900 text-stone-300 border-stone-700/80 hover:bg-stone-800'
          }`}
          title="Click to inspect model engine details"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isConfigured ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span className="truncate max-w-[190px] sm:max-w-[260px]">
            {isConfigured ? `Gemma: ${modelName}` : 'Engine: Deterministic Demo'}
          </span>
          <Info className="w-3 h-3 text-stone-400 shrink-0" />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#12141c] border border-stone-700 rounded-lg shadow-2xl p-6 text-stone-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded bg-stone-900 border border-stone-800 text-amber-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg text-stone-100">AI Model Architecture & Telemetry</h3>
                <p className="text-xs font-mono text-stone-400">Open-Weight Gemma 2 Integration Specification</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-3.5 rounded bg-stone-950/80 border border-stone-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider font-mono text-stone-400">Current Active Mode</span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded ${
                      isConfigured
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-700/40'
                    }`}
                  >
                    {isConfigured ? 'Live Hosted Gemma' : 'Deterministic Grounded Demo'}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed mt-2">
                  {status?.message ||
                    'Operating in deterministic demo mode. All ghost dialogues and reports are strictly grounded in project codex documentation without pretending to be an active neural inference.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                  Intended Core Model: Gemma 2 (Open-Weight)
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Per the competition brief, <strong>Gemma 2</strong> (Google&apos;s state-of-the-art open-weight model family) is the intended core model. This application never substitutes a closed Gemini model under the guise of Gemma.
                </p>
              </div>

              <div className="p-3.5 rounded bg-stone-900/60 border border-stone-800 text-xs font-mono space-y-2">
                <div className="flex items-center gap-2 text-amber-300">
                  <Key className="w-4 h-4" />
                  <span>How to connect live hosted Gemma in your environment:</span>
                </div>
                <p className="text-stone-400">
                  Set any of these environment variables in your server <code className="text-stone-200">.env</code>:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-stone-300">
                  <li><code className="text-emerald-400">GROQ_API_KEY</code> (fastest inference for gemma2-9b-it)</li>
                  <li><code className="text-emerald-400">HUGGINGFACE_API_KEY</code> (routes to google/gemma-2-9b-it)</li>
                  <li><code className="text-emerald-400">GEMMA_BASE_URL</code> + <code className="text-emerald-400">GEMMA_API_KEY</code> (Ollama, vLLM, or self-hosted)</li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-mono transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
