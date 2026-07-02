import { ScoreStatistic as PrismaScoreStatistic } from '@prisma/client';
import { Subject, subjectByColumnName } from './Subject';

export class StatisticModel {
  readonly subject: string;
  readonly displayName: string;
  readonly bands: { band: string; count: number }[];

  constructor(subject: string, records: PrismaScoreStatistic[]) {
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
