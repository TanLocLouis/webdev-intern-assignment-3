import { Request, Response } from 'express';
import { ScoreService } from '../services/ScoreService';
import { sbdSchema } from '../validators/scoreValidator';

const scoreService = new ScoreService();

export class ScoreController {
  async getScores(req: Request, res: Response): Promise<void> {
    const parsed = sbdSchema.safeParse(req.params.sbd);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid registration number. Must be an 8-digit number.',
        errors: parsed.error.flatten().formErrors,
      });
      return;
    }

    // Call to scoreService
    const student = await scoreService.getStudentBySbd(parsed.data);

    if (!student) {
      res.status(404).json({
        success: false,
        message: `No student found with registration number: ${parsed.data}`,
      });
      return;
    }

    res.json({ success: true, data: student.toJSON() });
  }
}
