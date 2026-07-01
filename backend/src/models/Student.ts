import { Student as PrismaStudent } from '@prisma/client';
import { ALL_SUBJECTS, ScoreBand, Subject } from './Subject';

export interface SubjectScore {
  subject: Subject;
  score: number | null;
  band: ScoreBand;
}

export class StudentModel {
  readonly sbd: string;
  readonly scores: SubjectScore[];
  readonly ma_ngoai_ngu: string | null;

  constructor(data: PrismaStudent) {
    this.sbd = data.sbd;
    this.ma_ngoai_ngu = data.ma_ngoai_ngu;

    this.scores = ALL_SUBJECTS.map((subject) => {
      // Check does this student has current subject
      const rawScore = data[subject.columnName as keyof PrismaStudent];
      const score = rawScore !== null && rawScore !== undefined ? Number(rawScore) : null;
      return {
        subject,
        score,
        band: subject.getBand(score),
      };
    });
  }

  // Convert from student Object toJSON
  toJSON() {
    return {
      sbd: this.sbd,
      ma_ngoai_ngu: this.ma_ngoai_ngu,
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
