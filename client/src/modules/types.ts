export type Subject = "math" | "reading" | "science" | "creativity" | "music" | "social";

export type AgeBand = "2-4" | "5-7" | "8-10" | "11-13" | "14+";

export interface ModuleMeta {
  id: string;
  title: string;
  subject: Subject;
  topics: string[];
  ageBand: AgeBand;
  gradeBand?: string; // e.g., "2" or "2-3"
  skills: string[];
  prerequisites?: string[];
  learningObjectives?: string[];
  standards?: string[];
  modality: Array<"voice" | "draw" | "game" | "quiz" | "story">;
  activityType: string[];
  duration: number; // minutes
  assets?: string[];
  themeTags?: string[];
  languages?: string[];
  accessibility?: string[];
  difficulty?: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  funFactor?: 1 | 2 | 3 | 4 | 5;
  requires?: string[];
  enabled: boolean;
  // runtime per-child overlays
  masteryScore?: number; // 0..1
  struggleScore?: number; // 0..1
  preferenceScore?: number; // 0..1
  lastPlayedAt?: string; // ISO
  timesPlayed?: number;
  streakDays?: number;
  recentlyReviewed?: boolean;
}

export interface FilterParams {
  subject?: Subject;
  topics?: string[];
  skills?: string[];
  gradeBand?: string;
  ageBand?: AgeBand;
  modality?: Array<"voice" | "draw" | "game" | "quiz" | "story">;
  activityType?: string[];
  themeTags?: string[];
  maxDuration?: number;
  sort?: "relevance" | "struggle" | "fun" | "recent" | "continue" | "quick" | "novelty";
  timeWindow?: { since?: string; until?: string };
}

export interface Section {
  id: string;
  title: string;
  modules: ModuleMeta[];
}


