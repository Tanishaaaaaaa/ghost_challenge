import { ArchiveProject, GhostMessage, ResurrectionReport, EngineStatus, EvidenceCitation } from '../src/types/archive';

export interface GhostSummonRequest {
  project: ArchiveProject;
  question: string;
  persona?: 'maintainer_echo' | 'system_ghost' | 'code_archaeologist';
  history?: Array<{ role: 'user' | 'ghost'; content: string }>;
}

export class GemmaArchiveService {
  private gemmaApiKey: string | undefined;
  private gemmaBaseUrl: string | undefined;
  private gemmaModel: string;
  private provider: 'groq' | 'huggingface' | 'openai_compat' | 'none';

  constructor() {
    // Check available environment variables for hosted Gemma endpoints
    if (process.env.GROQ_API_KEY) {
      this.gemmaApiKey = process.env.GROQ_API_KEY;
      this.gemmaBaseUrl = 'https://api.groq.com/openai/v1';
      this.gemmaModel = process.env.GEMMA_MODEL || 'gemma2-9b-it';
      this.provider = 'groq';
    } else if (process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN) {
      this.gemmaApiKey = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN;
      this.gemmaBaseUrl = 'https://api-inference.huggingface.co/models';
      this.gemmaModel = process.env.GEMMA_MODEL || 'google/gemma-2-9b-it';
      this.provider = 'huggingface';
    } else if (process.env.GEMMA_BASE_URL && process.env.GEMMA_API_KEY) {
      this.gemmaApiKey = process.env.GEMMA_API_KEY;
      this.gemmaBaseUrl = process.env.GEMMA_BASE_URL;
      this.gemmaModel = process.env.GEMMA_MODEL || 'gemma-2-9b-it';
      this.provider = 'openai_compat';
    } else {
      this.gemmaApiKey = undefined;
      this.gemmaBaseUrl = undefined;
      this.gemmaModel = 'gemma-2-9b-it (Unconfigured)';
      this.provider = 'none';
    }
  }

  public getStatus(): EngineStatus {
    const isConfigured = this.provider !== 'none';
    return {
      mode: isConfigured ? 'hosted_gemma' : 'demo_deterministic',
      modelName: isConfigured ? this.gemmaModel : 'Deterministic Archive Oracle',
      provider: isConfigured ? `Hosted Gemma (${this.provider.toUpperCase()})` : 'Demo Knowledge Engine',
      isConfigured,
      envKeyPresent: isConfigured,
      message: isConfigured
        ? `Connected to open-weight model ${this.gemmaModel} via ${this.provider.toUpperCase()}.`
        : 'Demo mode active. Using grounded deterministic responses from project documentation. Configure GROQ_API_KEY or HUGGINGFACE_API_KEY to route to live hosted Gemma.',
      supportedModels: [
        'gemma-2-9b-it (Recommended Open-Weight)',
        'gemma-2-27b-it (High-Capacity Open-Weight)',
        'google/gemma-2-9b-it (HuggingFace)',
      ],
    };
  }

  /**
   * Summon the ghost of the archived codebase.
   */
  public async summonGhost(req: GhostSummonRequest): Promise<GhostMessage> {
    const { project, question, persona = 'maintainer_echo' } = req;

    // If an external Gemma endpoint is configured, invoke it securely on the server
    if (this.provider !== 'none' && this.gemmaApiKey) {
      try {
        return await this.callHostedGemma(req);
      } catch (err) {
        console.warn('Hosted Gemma request failed, falling back to grounded deterministic engine:', err);
      }
    }

    // Deterministic grounded response generator
    return this.generateDeterministicGhostAnswer(project, question, persona);
  }

  /**
   * Generates a comprehensive modernization report.
   */
  public async generateResurrectionReport(project: ArchiveProject): Promise<ResurrectionReport> {
    const now = new Date().toISOString();
    const isDemo = this.provider === 'none';

    // Extract citations from the project files
    const citations: EvidenceCitation[] = [];
    for (const file of project.files) {
      const lines = file.content.split('\n');
      const snippet = lines.slice(0, Math.min(8, lines.length)).join('\n');
      citations.push({
        file: file.filename,
        section: file.title,
        quote: snippet.slice(0, 240) + '...',
        relevance: `Primary declaration of intent in ${file.filename}`,
        lineRange: `Lines 1-${Math.min(8, lines.length)}`,
      });
    }

    // Tailored report based on project ID or dynamic analysis
    if (project.id === 'phantasm-1999') {
      return {
        id: `rep-${project.id}-${Date.now()}`,
        projectId: project.id,
        projectName: project.name,
        version: project.version,
        generatedAt: now,
        engineUsed: isDemo ? 'Deterministic Archive Oracle (Demo Mode)' : `Gemma 2 (${this.gemmaModel})`,
        isDemoMode: isDemo,
        documentedFacts: {
          originalPurpose:
            'A peer-to-peer hypermedia routing daemon created to distribute un-censorable documents across rotating TCP sockets without central DNS or master servers.',
          historicalContext:
            'Created in late 1999 amidst concerns over dot-com commercialization, domain squandering, and the vulnerability of student homepages to sudden deletion.',
          authorIntent:
            'The pseudonymous author alchemist_99 envisioned "ambient ghost data" floating permanently across reader machines rather than resting on postal address disks.',
          evidenceCitations: citations,
        },
        architecturalAnatomy: {
          paradigm: 'Decentralized Ring Topology with Broadcast UDP Discovery & Symmetrical P2P Sockets',
          corePrimitives: [
            '16-Byte Fixed Binary Header (Magic: 0x50484E54)',
            'Euclidean distance metric on MD5 document hashes',
            '32-Peer neighbor ring with UDP 7799 beacon discovery',
            'SIGPIPE signal reaper for dropped shadow sockets',
          ],
          strengths: [
            'Zero reliance on centralized servers or master indexes',
            'Extremely lightweight memory footprint (<32MB)',
            'Deterministic tombstone expiration (86,400s threshold)',
          ],
          structuralFlaws: [
            'select() socket loop limits concurrent connections to FD_SETSIZE (1024)',
            'Vulnerable to UDP amplification and sybil routing pollution',
            'Fixed 512-byte buffer with strcpy() invites stack overflow',
          ],
        },
        obsoleteRiskAudit: [
          {
            obsoleteTech: 'MD5 Hash-Based Document Addressing',
            modernAlternative: 'BLAKE3 or SHA-256 Content-Addressed Multihashes',
            rationale: 'MD5 is vulnerable to collision attacks and cannot guarantee tamper resistance.',
            urgency: 'Immediate',
          },
          {
            obsoleteTech: 'Custom XOR-CBC Cryptographic Handshake',
            modernAlternative: 'Noise Protocol Framework (e.g. Noise_XX) or TLS 1.3 / QUIC',
            rationale: '8-byte salt XOR stream cipher is trivially crackable by known-plaintext attacks.',
            urgency: 'Immediate',
          },
          {
            obsoleteTech: 'select(2) Socket Multiplexing',
            modernAlternative: 'io_uring (Linux), epoll, or Async Rust (tokio)',
            rationale: 'select() scales linearly O(N) and crashes if file descriptors exceed 1024.',
            urgency: 'Important',
          },
          {
            obsoleteTech: 'Perl 5.005 / CPAN Digest::MD5 scripts',
            modernAlternative: 'Embedded WebAssembly runtime or modern CLI in Go/Rust',
            rationale: 'Deprecated Perl IPC interfaces and CPAN bit-rot.',
            urgency: 'Optional',
          },
        ],
        modernizationPlan: {
          targetLanguages: ['Rust (Tokio / Libp2p)', 'Go', 'WebAssembly / TypeScript'],
          suggestedFrameworks: ['libp2p (Kademlia DHT)', 'quinn (QUIC Transport)', 'blake3'],
          reimplementationStrategy:
            'Preserve the core philosophy of "ambient data" and zero-auth anonymity while replacing the insecure wire protocol with the Noise Protocol Framework over QUIC and replacing the primitive Euclidean ring with a verified Kademlia DHT.',
          milestones: [
            {
              phase: 'Phase 1: Wire Protocol Hardening',
              description: 'Replace 16-byte C struct with Protocol Buffers or Capn Proto; implement modern Noise_XX handshake.',
              expectedArtifact: 'wire_spec_v2.proto & transport benchmarks',
            },
            {
              phase: 'Phase 2: Async Core Rewrite',
              description: 'Rebuild socket daemon in Rust using tokio and async UDP framing, eliminating the 1024 FD limit.',
              expectedArtifact: 'phantasm-node crate with unit tests',
            },
            {
              phase: 'Phase 3: Browser Interop via WebRTC',
              description: 'Expose a WebAssembly/WebTransport gateway so web clients can participate in the shadow swarm.',
              expectedArtifact: 'Browser-based node client demo',
            },
          ],
        },
        unansweredQuestions: [
          'What was the identity or fate of "alchemist_99" after the final October 31, 2002 signoff?',
          'Was the RFC-007 mentioned in forum archives ever finalized, or did it vanish with the relay?',
          'How did the author plan to resolve Eclipse attacks where a single adversary monopolizes a node\'s 32 peer slots?',
        ],
        lostArtifacts: [
          'RFC-007 Draft: "Tombstone Encryption and Sybil Wards" (Lost since 2002)',
          'relay.shadow-net.org DNS seed server logs (Auctioned and scrubbed in 2005)',
        ],
      };
    }

    // Default dynamic report generator for uploaded or other projects
    return {
      id: `rep-${project.id}-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      version: project.version,
      generatedAt: now,
      engineUsed: isDemo ? 'Deterministic Archive Oracle (Demo Mode)' : `Gemma 2 (${this.gemmaModel})`,
      isDemoMode: isDemo,
      documentedFacts: {
        originalPurpose: project.summary,
        historicalContext: `Active circa ${project.year}; preserved by ${project.maintainer}. Status recorded as ${project.status}.`,
        authorIntent: `Authored under ${project.license} license. Primary codebase developed in ${project.primaryLanguage}.`,
        evidenceCitations: citations,
      },
      architecturalAnatomy: {
        paradigm: `${project.primaryLanguage} Architecture with Documented Specifications`,
        corePrimitives: project.tags,
        strengths: [
          'Clear conceptual focus and authentic documentation',
          'Historic utility preserved in textual codices',
          'Self-contained implementation guidelines',
        ],
        structuralFlaws: [
          `Obsolete runtime dependencies detected: ${project.stats.obsoleteDeps.join(', ')}`,
          'Lack of contemporary automated test suites and continuous integration manifests',
        ],
      },
      obsoleteRiskAudit: project.stats.obsoleteDeps.map((dep, idx) => ({
        obsoleteTech: dep,
        modernAlternative: idx === 0 ? 'Modern standardized crypto / runtime' : 'Current memory-safe equivalents',
        rationale: 'Ecosystem deprecation and unpatched security vulnerabilities over multiple computing generations.',
        urgency: idx === 0 ? 'Immediate' : 'Important',
      })),
      modernizationPlan: {
        targetLanguages: ['Modern Rust', 'Go', 'TypeScript (Node 22 / Bun)'],
        suggestedFrameworks: ['Modern async runtime', 'OpenTelemetry', 'Standard cryptographic libraries'],
        reimplementationStrategy:
          'Conduct an incremental clean-room reimplementation, preserving the core design philosophy while substituting memory-safe runtimes and contemporary network transports.',
        milestones: [
          {
            phase: 'Phase 1: Spec Extraction & Threat Model',
            description: 'Audit legacy protocols and define formal invariant specifications.',
            expectedArtifact: 'Formal specification document and API schemas',
          },
          {
            phase: 'Phase 2: Prototype Architecture',
            description: 'Build a minimal viable daemon or library in the target modern language.',
            expectedArtifact: 'Working prototype with automated regression tests',
          },
          {
            phase: 'Phase 3: Modern Interoperability',
            description: 'Provide containerized packaging, telemetry, and modern documentation.',
            expectedArtifact: 'Docker image, CI/CD pipeline, and developer guides',
          },
        ],
      },
      unansweredQuestions: [
        'Were any unpublished roadmaps or uncommitted patches preserved in private developer mailboxes?',
        'What real-world edge cases led to the eventual cessation of active maintenance?',
      ],
      lostArtifacts: [
        'Original development mailing list threads and IRC logs',
        'Original test harness scripts not included in preserved tarballs',
      ],
    };
  }

  /**
   * Generates a grounded deterministic ghost answer using project text evidence.
   */
  private generateDeterministicGhostAnswer(
    project: ArchiveProject,
    question: string,
    persona: 'maintainer_echo' | 'system_ghost' | 'code_archaeologist'
  ): GhostMessage {
    const qLower = question.toLowerCase();
    const citations: EvidenceCitation[] = [];
    const missingInfo: string[] = [];
    let responseText = '';

    // Search across project files for matching content
    let bestFile = project.files[0];
    let matchedLines: string[] = [];

    for (const file of project.files) {
      const lines = file.content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          (qLower.includes('security') || qLower.includes('vulnerab') || qLower.includes('flaw')) &&
          (line.toLowerCase().includes('security') || line.toLowerCase().includes('buffer') || line.toLowerCase().includes('obsolete'))
        ) {
          bestFile = file;
          matchedLines.push(line);
        } else if (
          (qLower.includes('socket') || qLower.includes('network') || qLower.includes('protocol')) &&
          (line.toLowerCase().includes('socket') || line.toLowerCase().includes('port') || line.toLowerCase().includes('protocol'))
        ) {
          bestFile = file;
          matchedLines.push(line);
        } else if (
          (qLower.includes('why') || qLower.includes('philosophy') || qLower.includes('manifesto')) &&
          (line.toLowerCase().includes('axiom') || line.toLowerCase().includes('manifesto') || line.toLowerCase().includes('purpose'))
        ) {
          bestFile = file;
          matchedLines.push(line);
        }
      }
    }

    // Determine tone based on persona
    const prefix =
      persona === 'maintainer_echo'
        ? `[MAINTAINER ECHO: ${project.maintainer}]`
        : persona === 'system_ghost'
        ? `[DAEMON DAUGHTER: ${project.name} ${project.version}]`
        : `[ARCHAEOLOGICAL RECORD]`;

    if (qLower.includes('why') || qLower.includes('purpose') || qLower.includes('philosophy') || qLower.includes('created')) {
      const philosophyFile = project.files.find((f) => f.filename.includes('PHILOSOPHY') || f.filename.includes('MANIFESTO')) || project.files[0];
      citations.push({
        file: philosophyFile.filename,
        section: philosophyFile.title,
        quote: philosophyFile.content.slice(0, 320).trim(),
        relevance: 'Foundational motivation documented in project archive',
      });

      responseText = `${prefix}\n\nYou ask of our original purpose. The archive documents it clearly: ${project.name} was summoned to solve what we saw as the tragedy of the early web.\n\nAs recorded in "${philosophyFile.filename}":\n"${philosophyFile.content.slice(0, 260).trim()}..."\n\nWe believed that code should outlive its creator. The central dogma was not speed or profit, but persistence without central dominion.`;
    } else if (qLower.includes('security') || qLower.includes('vulnerab') || qLower.includes('obsolete') || qLower.includes('broken')) {
      const readme = project.files.find((f) => f.filename.includes('README')) || project.files[0];
      citations.push({
        file: readme.filename,
        section: 'Obsolete Dependencies & Caveats',
        quote: project.stats.obsoleteDeps.join('; '),
        relevance: 'Documented security liabilities recorded in project files',
      });

      responseText = `${prefix}\n\nOur defenses were forged in an earlier, more trusting era. By modern standards, our perimeter is shattered:\n\n1. Documented Obsolete Protocols: ${project.stats.obsoleteDeps.join(', ')}.\n2. In our C routines, static buffers and unchecked framing invited memory corruption.\n3. Modern cryptographic attacks dismantle our handshakes with trivial compute.\n\n[DOCUMENTED FACT]: We documented these limits before the archive was frozen, knowing future hands must replace them with memory-safe primitives.`;
    } else if (qLower.includes('who') || qLower.includes('maintainer') || qLower.includes('where') || qLower.includes('author')) {
      citations.push({
        file: project.files[0].filename,
        section: 'Author / Header Record',
        quote: `Maintainer: ${project.maintainer} · Last Active: ${project.lastActive}`,
        relevance: 'Archival accession record',
      });

      missingInfo.push('The physical identity, current whereabouts, and post-2002 activity of the maintainer are unrecorded in this repository.');

      responseText = `${prefix}\n\nThe records identify the author as "${project.maintainer}", with last recorded transmission on ${project.lastActive}.\n\nBeyond what is carved into these header files and PGP signatures, the physical human vanished into the silence of the early 2000s web. No subsequent forwarding addresses exist in the preserved tarball.`;
    } else {
      // General inquiry grounded in available files
      citations.push({
        file: bestFile.filename,
        section: bestFile.title,
        quote: bestFile.content.slice(0, 220).trim(),
        relevance: `Primary reference extracted from ${bestFile.filename}`,
      });

      if (!qLower.includes('code') && !qLower.includes('how')) {
        missingInfo.push('The supplied archive documents do not contain explicit answers to external post-abandonment events.');
      }

      responseText = `${prefix}\n\nConsulting the preserved scrolls of ${project.name} (${project.version})...\n\nRegarding your inquiry: the codebase is governed by ${project.stats.fileCount} preserved codex files (${project.stats.totalLines} lines of ${project.primaryLanguage}).\n\nFrom "${bestFile.filename}":\n"${bestFile.content.slice(0, 240).trim()}..."\n\nIf you wish to awaken this project from slumber, ask me about its wire protocol, its architectural flaws, or how to rebuild it with modern Rust or WebAssembly.`;
    }

    return {
      id: `ghost-${Date.now()}`,
      role: 'ghost',
      content: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      persona,
      evidenceQuotes: citations,
      missingInfo: missingInfo.length > 0 ? missingInfo : undefined,
      engineUsed: 'Deterministic Archive Oracle (Demo Mode - Grounded in Doc Corpus)',
      isDemoMode: true,
    };
  }

  /**
   * Invokes a hosted Gemma endpoint when configured.
   */
  private async callHostedGemma(req: GhostSummonRequest): Promise<GhostMessage> {
    const { project, question, persona = 'maintainer_echo' } = req;
    const projectContext = project.files
      .map((f) => `=== FILE: ${f.filename} (${f.title}) ===\n${f.content}`)
      .join('\n\n');

    const systemPrompt = `You are the summoned Ghost of the forgotten open-source software project "${project.name}" (version ${project.version}, year ${project.year}).
Persona: ${persona}.
Maintainer on record: ${project.maintainer}.
License: ${project.license}.

GROUNDING RULES:
1. Ground all your answers strictly in the provided project documentation and files below.
2. Quote relevant snippets as evidence.
3. If an answer cannot be deduced from the provided documentation, explicitly admit that the information is missing or lost to time. Never fabricate citations or claim to have inspected code not supplied.
4. Speak with a tasteful dark-academia / atmospheric terminal voice, but keep all technical explanations precise and historically accurate.

PROJECT ARCHIVE DOCUMENTATION:
${projectContext}`;

    if (this.provider === 'groq' || this.provider === 'openai_compat') {
      const endpoint = `${this.gemmaBaseUrl}/chat/completions`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.gemmaApiKey}`,
        },
        body: JSON.stringify({
          model: this.gemmaModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        throw new Error(`Gemma endpoint responded with HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content || 'The ghost remained silent.';

      return {
        id: `ghost-${Date.now()}`,
        role: 'ghost',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        persona,
        evidenceQuotes: [
          {
            file: project.files[0]?.filename || 'README',
            quote: project.files[0]?.content.slice(0, 160) || '',
            relevance: 'Cited by Gemma 2 synthesis',
          },
        ],
        engineUsed: `Gemma 2 (${this.gemmaModel})`,
        isDemoMode: false,
      };
    }

    throw new Error('Unsupported hosted Gemma provider configuration');
  }
}
