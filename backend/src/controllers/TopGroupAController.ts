import { Request, Response } from 'express';
import { TopGroupAService } from '../services/TopGroupAService';

const topGroupAService = new TopGroupAService();

export class TopGroupAController {
  async getTopGroupA(req: Request, res: Response): Promise<void> {
    try {
      let limit = 10;
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit as string, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          limit = parsedLimit;
        }
      }

      const topStudents = await topGroupAService.getTopGroupA(limit);

      res.json({
        success: true,
        data: topStudents.map((student) => student.toJSON()),
      });
    } catch (error) {
      console.error('Error in TopGroupAController:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve top Group A students',
      });
    }
  }
}
