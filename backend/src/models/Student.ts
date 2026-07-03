import { Student as PrismaStudent, Score as PrismaScore, Subject as PrismaSubject } from '@prisma/client';
import { ALL_SUBJECTS, ALL_GROUP_A_SUBJECTS } from './Subject';
import { ScoreModel } from './Score';

type StudentWithScores = PrismaStudent & {
  scores: (PrismaScore & {
    subject: PrismaSubject;
  })[];
};

export class StudentModel {
  readonly sbd: string;
  readonly scores: ScoreModel[];
  readonly ma_ngoai_ngu: string | null;

  constructor(data: StudentWithScores) {
    this.sbd = data.registration_number;
    this.ma_ngoai_ngu = data.ma_ngoai_ngu;

    this.scores = ALL_SUBJECTS.map((subject) => {
      // Find the score in the scores array that matches this subject's code
      const scoreRecord = data.scores.find((s) => s.subject.code === subject.columnName);
      const score = scoreRecord ? Number(scoreRecord.score) : null;
      return new ScoreModel(subject, score);
    });
  }

  // Convert from student Object toJSON
  toJSON() {
    return {
      sbd: this.sbd,
      ma_ngoai_ngu: this.ma_ngoai_ngu,
      scores: this.scores.map((s) => s.toJSON()),
    };
  }
}

export interface RawTopGroupA {
  registration_number: string;
  toan: number | null;
  vat_li: number | null;
  hoa_hoc: number | null;
  total_score: number;
}

export class topGroupAModel {
  readonly sbd: string;
  readonly scores: ScoreModel[];
  readonly total_score: number;

  constructor(data: RawTopGroupA) {
    this.sbd = data.registration_number;

    this.scores = ALL_GROUP_A_SUBJECTS.map((subject) => {
      const val = data[subject.columnName as keyof RawTopGroupA];
      const score = val !== null && val !== undefined ? Number(val) : null;
      return new ScoreModel(subject, score);
    });

    this.total_score = Number(data.total_score);
  }

  // Convert from student Object toJSON
  toJSON() {
    return {
      sbd: this.sbd,
      total_score: this.total_score,
      scores: this.scores.map((s) => s.toJSON()),
    };
  }
}
