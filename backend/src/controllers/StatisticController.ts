import { Request, Response } from 'express';
import { StatisticService } from '../services/StatisticService';

const statisticService = new StatisticService();

export class StatisticsController {
  async getStatisticsForSubjects(req: Request, res: Response): Promise<void> {
    try {
      let subject = "";
      if (req.query.subject && typeof req.query.subject === 'string') {
        subject = req.query.subject;
      }

      const statistics = await statisticService.getStatisticsForSubjects(subject);

      res.json({
        success: true,
        data: statistics.map((statistic) => statistic.toJSON()),
      });
    } catch (error) {
      console.error('Error in StatisticController:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve statistics for subjects',
      });
    }
  }
}

