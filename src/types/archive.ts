export interface ArchiveFile {
  filename: string;
  title: string;
  content: string;
  language: string;
  lineCount: number;
  tags?: string[];
}

export interface ArchiveProject {
  id: string;
  name: string;
  subtitle: string;
  version: string;
  year: number;
  maintainer: string;
  status: 'abandoned' | 'dormant' | 'archived' | 'resurrected';
  lastActive: string;
  license: string;
  primaryLanguage: string;
  summary: string;
  image?: string;
  tags: string[];
  files: ArchiveFile[];
  stats: {
    fileCount: number;
    totalLines: number;
    obsoleteDeps: string[];
    riskScore: 'High' | 'Critical' | 'Moderate';
    mysteryLevel: string;
  };
}

export interface EvidenceCitation {
  file: string;
  section?: string;
  quote: string;
  relevance: string;
  lineRange?: string;
}

export interface GhostMessage {
  id: string;
  role: 'user' | 'ghost';
  content: string;
  timestamp: string;
  persona?: 'maintainer_echo' | 'system_ghost' | 'code_archaeologist';
  evidenceQuotes?: EvidenceCitation[];
  missingInfo?: string[];
  engineUsed?: string;
  isDemoMode?: boolean;
}

export interface ModernizationItem {
  obsoleteTech: string;
  modernAlternative: string;
  rationale: string;
  urgency: 'Immediate' | 'Important' | 'Optional';
}

export interface ResurrectionReport {
  id: string;
  projectId: string;
  projectName: string;
  version: string;
  generatedAt: string;
  engineUsed: string;
  isDemoMode: boolean;
  documentedFacts: {
    originalPurpose: string;
    historicalContext: string;
    authorIntent: string;
    evidenceCitations: EvidenceCitation[];
  };
  architecturalAnatomy: {
    paradigm: string;
    corePrimitives: string[];
    strengths: string[];
    structuralFlaws: string[];
  };
  obsoleteRiskAudit: ModernizationItem[];
  modernizationPlan: {
    targetLanguages: string[];
    suggestedFrameworks: string[];
    reimplementationStrategy: string;
    milestones: { phase: string; description: string; expectedArtifact: string }[];
  };
  unansweredQuestions: string[];
  lostArtifacts: string[];
}

export interface EngineStatus {
  mode: 'demo_deterministic' | 'hosted_gemma';
  modelName: string;
  provider: string;
  isConfigured: boolean;
  message: string;
  supportedModels: string[];
  envKeyPresent: boolean;
}
