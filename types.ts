export interface ViralAnalysis {
  hookStrategy: string;
  retentionTactics: string[];
  emotionalTriggers: string[];
  structureBreakdown: string;
  viralFactor: string;
  toneStyle: string;
}

export interface VideoIdea {
  title: string;
  premise: string;
  targetAudience: string;
  predictedViralScore: number;
}

export interface GeneratedScript {
  title: string;
  sections: ScriptSection[];
}

export interface ScriptSection {
  heading: string;
  content: string;
  visualCue: string;
}

export enum AppStep {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  ANALYSIS_VIEW = 'ANALYSIS_VIEW',
  GENERATING_IDEAS = 'GENERATING_IDEAS',
  IDEAS_VIEW = 'IDEAS_VIEW',
  GENERATING_SCRIPT = 'GENERATING_SCRIPT',
  SCRIPT_VIEW = 'SCRIPT_VIEW',
}