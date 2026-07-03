export enum ScoreBand {
  Excellent = '>=8',
  Good = '[6,8)',
  Average = '[4,6)',
  Poor = '<4',
  NotTaken = 'N/A',
}

// This is Subject abstract class
export abstract class Subject {
  abstract readonly name: string;
  abstract readonly columnName: string;
  abstract readonly displayName: string;

  getBand(score: number | null | undefined): ScoreBand {
    if (score === null || score === undefined) return ScoreBand.NotTaken;
    if (score >= 8) return ScoreBand.Excellent;
    if (score >= 6) return ScoreBand.Good;
    if (score >= 4) return ScoreBand.Average;
    return ScoreBand.Poor;
  }

  // Get scores' color base on scoreBand
  getBandColor(band: ScoreBand): string {
    const colors: Record<ScoreBand, string> = {
      [ScoreBand.Excellent]: '#22c55e',
      [ScoreBand.Good]: '#3b82f6',
      [ScoreBand.Average]: '#f59e0b',
      [ScoreBand.Poor]: '#ef4444',
      [ScoreBand.NotTaken]: '#94a3b8',
    };

    return colors[band];
  }
}

// Define Subject classes extend from abstract class Subject
export class MathSubject extends Subject {
  readonly name = 'toan';
  readonly columnName = 'toan';
  readonly displayName = 'Toán';
}

export class LiteratureSubject extends Subject {
  readonly name = 'ngu_van';
  readonly columnName = 'ngu_van';
  readonly displayName = 'Ngữ Văn';
}

export class ForeignLanguageSubject extends Subject {
  readonly name = 'ngoai_ngu';
  readonly columnName = 'ngoai_ngu';
  readonly displayName = 'Ngoại Ngữ';
}

export class PhysicsSubject extends Subject {
  readonly name = 'vat_li';
  readonly columnName = 'vat_li';
  readonly displayName = 'Vật Lí';
}

export class ChemistrySubject extends Subject {
  readonly name = 'hoa_hoc';
  readonly columnName = 'hoa_hoc';
  readonly displayName = 'Hóa Học';
}

export class BiologySubject extends Subject {
  readonly name = 'sinh_hoc';
  readonly columnName = 'sinh_hoc';
  readonly displayName = 'Sinh Học';
}

export class HistorySubject extends Subject {
  readonly name = 'lich_su';
  readonly columnName = 'lich_su';
  readonly displayName = 'Lịch Sử';
}

export class GeographySubject extends Subject {
  readonly name = 'dia_li';
  readonly columnName = 'dia_li';
  readonly displayName = 'Địa Lí';
}

export class CivicSubject extends Subject {
  readonly name = 'gdcd';
  readonly columnName = 'gdcd';
  readonly displayName = 'GDCD';
}

// Registry of all subjects
export const ALL_SUBJECTS: Subject[] = [
  new MathSubject(),
  new LiteratureSubject(),
  new ForeignLanguageSubject(),
  new PhysicsSubject(),
  new ChemistrySubject(),
  new BiologySubject(),
  new HistorySubject(),
  new GeographySubject(),
  new CivicSubject(),
];

// Registry of all group A subjects
export const ALL_GROUP_A_SUBJECTS: Subject[] = [
  new MathSubject(),
  new PhysicsSubject(),
  new ChemistrySubject(),
];

// Get Subject by its column name
export const subjectByColumnName = (col: string): Subject | undefined =>
  ALL_SUBJECTS.find((s) => s.columnName === col);

export interface RawScoreStatistic {
  subject: string;
  band: string;
  count: number;
}

export class StatisticModel {
  readonly subject: string;
  readonly displayName: string;
  readonly bands: { band: string; count: number }[];

  constructor(subject: string, records: RawScoreStatistic[]) {
    this.subject = subject;
    
    // Find matching display name from Subject helper
    const subjectObj = subjectByColumnName(subject);
    this.displayName = subjectObj ? subjectObj.displayName : subject;

    // Define standard bands order
    const bandOrder = ['>=8', '[6,8)', '[4,6)', '<4'];

    // Map bands or default to 0 if record doesn't exist
    this.bands = bandOrder.map((bandName) => {
      const match = records.find((r) => r.band === bandName);
      return {
        band: bandName,
        count: match ? match.count : 0,
      };
    });
  }

  toJSON() {
    return {
      subject: this.subject,
      displayName: this.displayName,
      bands: this.bands,
    };
  }
}
