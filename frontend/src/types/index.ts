export interface ScoreEntry {
  subject: string;
  displayName: string;
  score: number | null;
  band: '>=8' | '[6,8)' | '[4,6)' | '<4' | 'N/A';
  bandColor: string;
}

export interface StudentResult {
  sbd: string;
  ma_ngoai_ngu: string | null;
  scores: ScoreEntry[];
}

export interface BandCount {
  band: string;
  count: number;
}

export interface SubjectStatistic {
  subject: string;
  displayName: string;
  bands: BandCount[];
}

export interface TopGroupAStudent {
  sbd: string;
  total_score: number;
  scores: ScoreEntry[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
