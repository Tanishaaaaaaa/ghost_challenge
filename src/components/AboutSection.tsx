import React from 'react';
import { BookOpen, Cpu, ShieldCheck, Flame, Compass, Server, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import { EngineStatus } from '../types/archive';

interface AboutSectionProps {
  engineStatus: EngineStatus | null;
  onOpenIngest: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ engineStatus, onOpenIngest }) => {
  return (
    <div className="space-y-16 max-w-4xl mx-auto pb-16">
      {/* Title & Introduction */}
      <section className="border-b border-stone-800 pb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-500/90 tracking-widest uppercase">
          <Flame className="w-3.5 h-3.5" />
          <span>Hacktoberfest 2026 · Open-Source AI Challenge Week 4</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-stone-100 font-medium tracking-tight">
          Software Archaeology & The Open-Weight Imperative
        </h1>

        <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
          Software is humanity&apos;s most fragile cultural artifact. Stone tablets endure for millennia; paper manuscripts survive centuries; but a pioneering software system can be rendered completely inoperable in less than a decade when a compiler changes, a domain expires, or a dependency tree decays.
        </p>
      </section>

      {/* Part 1: Why Preserving Forgotten Software Matters */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-stone-100 flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>1. The Digital Dark Ages & Lost Computational Philosophies</span>
        </h2>

        <div className="text-xs sm:text-sm text-stone-300 space-y-4 font-sans leading-relaxed">
          <p>
            When an open-source project is abandoned, we lose far more than lines of executable syntax. We lose a specific, unrepeatable philosophical stance on how computing should work.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 rounded-lg bg-[#11131c] border border-stone-800 space-y-2">
              <span className="font-display text-base text-stone-200 block">
                The Forgotten Internet (1995–2005)
              </span>
              <p className="text-xs text-stone-400">
                Early decentralized protocols (like Phantasm or pre-commercial crawlers) operated under radical assumptions of peer symmetry and user autonomy that have been largely forgotten in our era of multi-tenant cloud platforms.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#11131c] border border-stone-800 space-y-2">
              <span className="font-display text-base text-stone-200 block">
                The Software Resurrection Mission
              </span>
              <p className="text-xs text-stone-400">
                Resurrection is not merely making old code compile; it is understanding original design constraints, isolating obsolete protocols (like MD5 or select loops), and translating those philosophies into memory-safe modern systems (Rust, WebAssembly, modern async I/O).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Open-Weight AI & Gemma */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-stone-100 flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>2. Why Open-Weight Models (Gemma 2) Are Essential</span>
        </h2>

        <div className="text-xs sm:text-sm text-stone-300 space-y-4 font-sans leading-relaxed">
          <p>
            Proprietary, closed-API models introduce the exact same existential vulnerability as proprietary software: if a vendor discontinues an API, alters terms of service, or modifies their safety filters, the historical analysis tool permanently breaks.
          </p>

          <div className="p-5 rounded-lg bg-[#11131d] border border-emerald-900/40 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>The Gemma 2 Open-Weight Advantages</span>
            </div>
            <ul className="space-y-2 text-stone-300 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">•</span>
                <span>
                  <strong>Portability & Longevity:</strong> The weights of Gemma 2 (2B, 9B, 27B) can be archived alongside the software repositories themselves. A researcher in 2050 will still be able to execute Gemma 2 on local silicon without asking permission from a corporate server.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">•</span>
                <span>
                  <strong>Grounded Evidence Without Black-Box Obfuscation:</strong> Open weights enable deterministic evaluation and fine-tuning specifically on historical technical documentation, preventing hallucinated citations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">•</span>
                <span>
                  <strong>Data Sovereignty:</strong> Delicate internal technical archives or confidential legacy system specs can be analyzed on-premise without transmitting proprietary code to third-party model providers.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Part 3: Runtime Transparency & Live Gemma Configuration */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-stone-100 flex items-center gap-2.5">
          <Server className="w-5 h-5 text-amber-400" />
          <span>3. Runtime Architecture & Honest Configuration Status</span>
        </h2>

        <div className="text-xs sm:text-sm text-stone-300 space-y-4 font-sans leading-relaxed">
          <p>
            In adherence to the Hacktoberfest guidelines, this application provides total transparency regarding model execution.
          </p>

          {/* Current Status Box */}
          <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-400 uppercase tracking-wider text-[11px]">Active Inference Mode</span>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] ${
                  engineStatus?.isConfigured
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {engineStatus?.isConfigured ? 'Live Hosted Gemma Engine' : 'Deterministic Grounded Demo Mode'}
              </span>
            </div>

            <p className="text-stone-300 font-sans text-xs">
              {engineStatus?.message ||
                'Running in deterministic demo mode. All ghost dialogues and reports are generated from deep semantic indexing of the authentic repository codex without calling an unconfigured external key.'}
            </p>

            <div className="pt-3 border-t border-stone-800/80 space-y-2">
              <span className="text-amber-400 font-semibold block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>How to activate live hosted Gemma 2:</span>
              </span>
              <p className="text-stone-400 font-sans text-xs">
                To route all inquiries to a live hosted Gemma 2 model instance on the backend, add any of the following to your server environment:
              </p>
              <div className="bg-stone-900 p-2.5 rounded text-[11px] text-stone-300 space-y-1">
                <div><code className="text-emerald-400">GROQ_API_KEY</code>=your_groq_key <span className="text-stone-500">(Runs gemma2-9b-it with sub-second latency)</span></div>
                <div><code className="text-emerald-400">HUGGINGFACE_API_KEY</code>=your_hf_key <span className="text-stone-500">(Routes to google/gemma-2-9b-it)</span></div>
                <div><code className="text-emerald-400">GEMMA_BASE_URL</code>=http://localhost:11434/v1 <span className="text-stone-500">(For local Ollama or vLLM deployments)</span></div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded bg-stone-900/40 border border-stone-800/80 text-xs text-stone-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <p>
              <strong>Offline Capability Note:</strong> This web application runs client-server in the AI Studio environment. It does not execute local browser WebGPU/Wasm models offline by default, but open-weight Gemma models are inherently capable of being hosted on private offline infrastructure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
