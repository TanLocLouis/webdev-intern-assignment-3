import { ScoreBand, Subject } from './Subject';

export interface SubjectScore {
  subject: Subject;
  score: number | null;
  band: ScoreBand;
}

export class ScoreModel {
  readonly subject: Subject;
  readonly score: number | null;
  readonly band: ScoreBand;

  constructor(subject: Subject, score: number | null) {
    this.subject = subject;
    this.score = score;
    this.band = subject.getBand(score);
  }

  toJSON() {
    return {
      subject: this.subject.name,
      displayName: this.subject.displayName,
      score: this.score,
      band: this.band,
      bandColor: this.subject.getBandColor(this.band),
    };
  }
}
