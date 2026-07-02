
import { TopGroupA as PrismaStudent } from '@prisma/client';
import { ALL_GROUP_A_SUBJECTS, ScoreBand, Subject } from './Subject';

export interface SubjectScore {
  subject: Subject;
  score: number | null;
  band: ScoreBand;
}

export class topGroupAModel {
  readonly sbd: string;
  readonly scores: SubjectScore[];
  readonly total_score: number;

  constructor(data: PrismaStudent) {
    this.sbd = data.sbd;

    this.scores = ALL_GROUP_A_SUBJECTS.map((subject) => {
      // Check does this student has current subject
      const rawScore = data[subject.columnName as keyof PrismaStudent];
      const score = rawScore !== null && rawScore !== undefined ? Number(rawScore) : null;
      return {
        subject,
        score,
        band: subject.getBand(score),
      };
    });

    this.total_score = this.scores.reduce((sum, s) => sum + (s.score ?? 0), 0);
  }

  // Convert from student Object toJSON
  toJSON() {
    return {
      sbd: this.sbd,
      total_score: this.total_score,
      scores: this.scores.map((s) => ({
        subject: s.subject.name,
        displayName: s.subject.displayName,
        score: s.score,
        band: s.band,
        bandColor: s.subject.getBandColor(s.band),
      })),
    };
  }
}
