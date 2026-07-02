import { Router } from 'express';
import { StatisticsController } from '../controllers/StatisticController';

const router = Router();
const controller = new StatisticsController();

// GET /api/v1/statistics
router.get('/', (req, res) => controller.getStatisticsForSubjects(req, res));

export default router;